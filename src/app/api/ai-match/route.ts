import { NextResponse } from "next/server";
import { getSettings, listJobs } from "@/server/jobhub-db";
import Groq from "groq-sdk";

type MatchedJob = {
  id: string;
  title: string;
  company: string;
  logo: string;
  logoBg: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  tags: string[];
  matchScore: number;
  matchReasons: string[];
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userSkills = [], avgCgpa = 0, courseNames = [], semester = 0 } = body;

    const allJobs = await listJobs();
    const settings = await getSettings();

    // LOCAL ALGORITHM (Fallback or explicitly selected)
    const runLocalAlgorithm = () => {
      const matched = allJobs
        .map((job: any) => {
          const jobTags: string[] = (job.tags || []).map((t: string) => t.toLowerCase());
          const jobReqs: string[] = (job.requirements || []).map((r: string) => r.toLowerCase());
          const jobTitle = (job.title || "").toLowerCase();
          const jobLevel = (job.level || "").toLowerCase();

          let score = 0;
          const reasons: string[] = [];

          // Skill match (max 50 pts)
          const matchedSkills = userSkills.filter(
            (s: string) =>
              jobTags.some((t) => t.includes(s) || s.includes(t)) ||
              jobReqs.some((r) => r.includes(s)) ||
              jobTitle.includes(s)
          );
          const skillScore = Math.min(50, Math.round((matchedSkills.length / Math.max(jobTags.length, 1)) * 50));
          score += skillScore;
          if (matchedSkills.length > 0) {
            reasons.push(`${matchedSkills.length} skill${matchedSkills.length > 1 ? "s" : ""} matched: ${matchedSkills.slice(0, 3).join(", ")}`);
          }

          // CGPA match (max 25 pts)
          if (avgCgpa >= 3.5) {
            score += 25;
            reasons.push(`Strong CGPA (${avgCgpa.toFixed(2)})`);
          } else if (avgCgpa >= 3.0) {
            score += 20;
            reasons.push(`Good CGPA (${avgCgpa.toFixed(2)})`);
          } else if (avgCgpa >= 2.5) {
            score += 12;
            reasons.push(`Adequate CGPA (${avgCgpa.toFixed(2)})`);
          }

          // Course relevance (max 15 pts)
          const courseMatches = courseNames.filter(
            (c: string) => jobTags.some((t) => c.includes(t) || t.includes(c))
          );
          if (courseMatches.length > 0) {
            const coursePts = Math.min(15, courseMatches.length * 5);
            score += coursePts;
            reasons.push(`${courseMatches.length} relevant course${courseMatches.length > 1 ? "s" : ""}`);
          }

          // Level match (max 10 pts)
          if (
            (jobLevel.includes("entry") || jobLevel.includes("junior") || jobLevel.includes("intern")) &&
            semester >= 4
          ) {
            score += 10;
            reasons.push("Level matches your experience");
          } else if (jobLevel.includes("mid") && semester >= 7) {
            score += 10;
            reasons.push("Level matches your seniority");
          }

          return {
            id: job.id,
            title: job.title || "",
            company: job.company || "",
            logo: job.logo || "",
            logoBg: job.logoBg || "",
            location: job.location || "",
            type: job.type || "",
            level: job.level || "",
            salary: job.salary || "",
            tags: job.tags || [],
            matchScore: Math.min(100, score),
            matchReasons: reasons,
          } as MatchedJob;
        })
        .filter((j: MatchedJob) => j.matchScore > 10)
        .sort((a: MatchedJob, b: MatchedJob) => b.matchScore - a.matchScore);

      return matched;
    };

    // GROQ AI INTEGRATION
    if (settings.provider === "groq" && settings.apiKey && settings.apiKey.length > 10) {
      try {
        const groq = new Groq({ apiKey: settings.apiKey });
        
        // Map user selected model or default
        const modelName = typeof settings.model === "string" && settings.model ? settings.model : "llama-3.1-8b-instant";
        
        const prompt = `
You are an expert AI recruiter matching a candidate to a list of available jobs.
Analyze the candidate's profile against each job and calculate a match score out of 100.
Also provide 2-3 brief reasons (max 10 words each) why they match.

Candidate Profile:
- Skills: ${userSkills.join(", ")}
- Completed Courses: ${courseNames.join(", ")}
- Average CGPA: ${avgCgpa.toFixed(2)} (Out of 4.0)
- Current Semester: ${semester}

Available Jobs (JSON):
${JSON.stringify(allJobs.map(j => ({ id: j.id, title: j.title, requirements: j.requirements, tags: j.tags, level: j.level })), null, 2)}

Return ONLY a valid JSON array of objects representing the matched jobs (score > 10). Do not include markdown formatting like \`\`\`json.
Each object must have exactly these keys:
- "id": string (the job id)
- "matchScore": number (0-100)
- "matchReasons": string[] (Array of short reasons)
`;

        const generateWithModel = async (targetModel: string) => {
          const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: targetModel,
          });
          
          let text = chatCompletion.choices[0]?.message?.content || "[]";
          text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          
          const aiMatches = JSON.parse(text) as { id: string; matchScore: number; matchReasons: string[] }[];
          return aiMatches.map(aim => {
            const job = allJobs.find(j => j.id === aim.id);
            if (!job) return null;
            return {
              id: job.id,
              title: job.title || "",
              company: job.company || "",
              logo: job.logo || "",
              logoBg: job.logoBg || "",
              location: job.location || "",
              type: job.type || "",
              level: job.level || "",
              salary: job.salary || "",
              tags: job.tags || [],
              matchScore: Math.min(100, Math.max(0, aim.matchScore)),
              matchReasons: aim.matchReasons || [],
            } as MatchedJob;
          }).filter(Boolean) as MatchedJob[];
        };

        try {
          const matched = await generateWithModel(modelName);
          return NextResponse.json({ success: true, matches: matched.sort((a, b) => b.matchScore - a.matchScore) });
        } catch (initialError: any) {
          console.warn(`Groq API Error with model ${modelName}:`, initialError.message);
          
          if (modelName !== "llama-3.1-8b-instant") {
            console.log("Retrying with llama-3.1-8b-instant fallback...");
            const fallbackMatched = await generateWithModel("llama-3.1-8b-instant");
            return NextResponse.json({ success: true, matches: fallbackMatched.sort((a, b) => b.matchScore - a.matchScore) });
          } else {
            throw initialError;
          }
        }

      } catch (groqError: any) {
        console.error("Groq API Error (all retries failed), falling back to local:", groqError.message);
        // Fallback to local on error
        return NextResponse.json({ success: true, fallbackWarning: "Groq API Error. Used local scoring.", matches: runLocalAlgorithm() });
      }
    }

    // Default to local algorithm
    return NextResponse.json({ success: true, matches: runLocalAlgorithm() });

  } catch (error) {
    console.error("Failed to run AI Match:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
