import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function requestJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Request failed");
  }

  return data as T;
}

export const useJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const data = await requestJson<{ success: true; jobs: any[] }>("/api/jobs");
      return data.jobs;
    },
  });
};

export const useJob = (id: string | undefined) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      if (!id) return null;
      const data = await requestJson<{ success: true; job: any }>(`/api/jobs/${id}`);
      return data.job;
    },
    enabled: !!id,
  });
};

export const useApplyJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, jobId }: { userId: string; jobId: string }) => {
      const data = await requestJson<{ success: true; application: any }>("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, job_id: jobId }),
      });
      return data.application;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applications", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["job", variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useApplications = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["applications", userId],
    queryFn: async () => {
      if (!userId) return [];
      const data = await requestJson<{ success: true; applications: any[] }>(`/api/applications?userId=${encodeURIComponent(userId)}`);
      return data.applications;
    },
    enabled: !!userId,
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ applicationId }: { applicationId: string }) => {
      const data = await requestJson<{ success: true }>(`/api/applications/${applicationId}`, {
        method: "DELETE",
      });
      return data;
    },
    onSuccess: (_, variables) => {
      // We don't have the userId in variables here, so we might need to invalidate all applications or pass userId
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      // Might want to invalidate the specific job, but we don't know the jobId here unless we pass it
    },
  });
};

// ── Saved / Bookmarked Jobs ──────────────────────────────────────────

export const useSavedJobs = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["savedJobs", userId],
    queryFn: async () => {
      if (!userId) return [];
      const data = await requestJson<{ success: true; savedJobs: any[] }>(`/api/saved-jobs?userId=${encodeURIComponent(userId)}`);
      return data.savedJobs;
    },
    enabled: !!userId,
  });
};

export const useSavedJobIds = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["savedJobIds", userId],
    queryFn: async () => {
      if (!userId) return [];
      const data = await requestJson<{ success: true; savedIds: string[] }>(`/api/saved-jobs?userId=${encodeURIComponent(userId)}&idsOnly=true`);
      return data.savedIds;
    },
    enabled: !!userId,
  });
};

export const useSaveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, jobId }: { userId: string; jobId: string }) => {
      return requestJson<{ success: true }>("/api/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, job_id: jobId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
      queryClient.invalidateQueries({ queryKey: ["savedJobIds"] });
    },
  });
};

export const useUnsaveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, jobId }: { userId: string; jobId: string }) => {
      return requestJson<{ success: true }>(`/api/saved-jobs/${jobId}?userId=${encodeURIComponent(userId)}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
      queryClient.invalidateQueries({ queryKey: ["savedJobIds"] });
    },
  });
};

export const useCandidates = (jobId?: string, company?: string) => {
  return useQuery({
    queryKey: ["candidates", jobId, company],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (jobId) params.set("jobId", jobId);
      if (company) params.set("company", company);
      const suffix = params.toString();
      const data = await requestJson<{ success: true; candidates: any[] }>(`/api/candidates${suffix ? `?${suffix}` : ""}`);
      return data.candidates;
    },
  });
};

export const useEmployerJobs = (company: string | undefined) => {
  return useQuery({
    queryKey: ["employer_jobs", company],
    queryFn: async () => {
      if (!company) return [];
      const data = await requestJson<{ success: true; jobs: any[] }>(`/api/employer-jobs?company=${encodeURIComponent(company)}`);
      return data.jobs;
    },
    enabled: !!company,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobData: any) => {
      return requestJson<{ success: true }>("/api/employer-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employer_jobs", variables.company] });
    },
  });
};

export const useDeleteEmployerJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      return requestJson<{ success: true }>(`/api/employer-jobs?id=${jobId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer_jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useDashboardStats = (userId?: string) => {
  return useQuery({
    queryKey: ["stats", userId],
    queryFn: async () => {
      const url = userId ? `/api/stats?userId=${encodeURIComponent(userId)}` : "/api/stats";
      return requestJson<Record<string, any>>(url);
    },
  });
};

export const useProfile = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const data = await requestJson<{ success: true; profile: any }>(`/api/profile?userId=${encodeURIComponent(userId)}`);
      return data.profile;
    },
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: async (profileData: any) => {
      const data = await requestJson<{ success: true; profile: any }>("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, ...profileData }),
      });
      return data.profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  return { ...query, updateProfile: mutation.mutateAsync };
};

export const useSaveSkills = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skills: { name: string; level: string }[]) => {
      const data = await requestJson<{ success: true; profile: any }>("/api/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, skills }),
      });
      return data.profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
};

export type AcademicRecord = {
  id?: number;
  user_id?: string;
  semester: number;
  course_code: string;
  course_name: string;
  credit: number;
  cgpa: number;
};

export const useAcademicRecords = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["academic", userId],
    queryFn: async () => {
      if (!userId) return [];
      const data = await requestJson<{ success: true; records: AcademicRecord[] }>(
        `/api/academic?userId=${encodeURIComponent(userId)}`
      );
      return data.records;
    },
    enabled: !!userId,
  });

  const saveMutation = useMutation({
    mutationFn: async (records: AcademicRecord[]) => {
      const data = await requestJson<{ success: true; records: AcademicRecord[] }>("/api/academic", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, records }),
      });
      return data.records;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await requestJson<{ success: true }>(
        `/api/academic?id=${id}&userId=${encodeURIComponent(userId ?? "")}`,
        { method: "DELETE" }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", userId] });
    },
  });

  return {
    ...query,
    saveRecords: saveMutation.mutateAsync,
    deleteRecord: deleteMutation.mutateAsync,
    isSaving: saveMutation.isPending,
  };
};

export const useUpdateJobSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: { id: string; aiScreening: boolean; minScore: number; roleMapping: string }) => {
      const data = await requestJson<{ success: true }>("/api/employer-jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employer-jobs"] });
    },
  });
};

export const useUpdateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; status: string }) => {
      const response = await requestJson<{ success: true }>("/api/candidates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
};

export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await requestJson<{ success: true }>(`/api/candidates?id=${id}`, {
        method: "DELETE",
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
};

export const useAnalytics = (company: string | null) => {
  return useQuery({
    queryKey: ["analytics", company],
    queryFn: async () => {
      if (!company) return [];
      const data = await requestJson<{ success: true; analytics: any[] }>(`/api/analytics?company=${encodeURIComponent(company)}`);
      return data.analytics;
    },
    enabled: !!company,
  });
};

export const useRecommendations = () => {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const data = await requestJson<{ success: true; roles: any[] }>("/api/recommendations");
      return data.roles;
    },
  });
};

export const useAuditLogs = (limit = 100) => {
  return useQuery({
    queryKey: ["audit-logs", limit],
    queryFn: async () => {
      const data = await requestJson<{ success: true; logs: any[] }>(`/api/audit-logs?limit=${limit}`);
      return data.logs;
    },
  });
};
