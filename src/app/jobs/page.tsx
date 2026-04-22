"use client";

import { Suspense } from "react";
import Jobs from "@/views/Jobs";

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pb-24" />}>
      <Jobs />
    </Suspense>
  );
}
