import { Navbar } from "@/components/layout/Navbar";
import { JobCard } from "@/components/JobCard";
import { FilterSidebar, Filters } from "@/components/FilterSidebar";
import { useMemo, useState } from "react";
import { useSearchParams } from "@/lib/router";
import { useJobs } from "@/hooks/useAPI";
import { Job } from "@/types";
import { Search } from "lucide-react";

const Jobs = () => {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [filters, setFilters] = useState<Filters>({ types: [], levels: [], remote: false });

  const { data: jobs = [], isLoading } = useJobs();

  const filtered = useMemo(() => {
    return jobs.filter((j: Job) => {
      let matchQuery = true;
      if (query) {
        const titleMatch = j.title?.toLowerCase().includes(query.toLowerCase());
        const compMatch = j.company?.toLowerCase().includes(query.toLowerCase());
        const tagMatch = j.tags?.some((t: string) => t.toLowerCase().includes(query.toLowerCase()));
        matchQuery = !!(titleMatch || compMatch || tagMatch);
      }
      if (!matchQuery) return false;
      if (filters.types.length && !filters.types.includes(j.type)) return false;
      if (filters.levels.length && !filters.levels.includes(j.level)) return false;
      if (filters.remote && !j.remote) return false;
      return true;
    });
  }, [query, filters]);

  return (
    <div className="min-h-screen pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl tracking-tight mb-2">Browse jobs</h1>
          <p className="text-muted-foreground">{filtered.length} roles matching your search</p>
        </div>

        <div className="glass-strong rounded-2xl p-2 flex items-center gap-3 mb-8 max-w-2xl">
          <Search className="w-4 h-4 text-muted-foreground ml-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, company, or skill"
            className="flex-1 bg-transparent outline-none text-sm py-2 font-medium"
          />
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <FilterSidebar filters={filters} setFilters={setFilters} />

          <div className="grid md:grid-cols-2 gap-5">
            {isLoading && <div className="text-muted-foreground p-8">Loading jobs...</div>}
            {!isLoading && filtered.map((j: Job, i: number) => (
              <JobCard key={j.id} job={j} index={i} />
            ))}
            {!isLoading && filtered.length === 0 && (
              <div className="md:col-span-2 glass rounded-3xl p-12 text-center">
                <p className="text-muted-foreground">No jobs match your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
