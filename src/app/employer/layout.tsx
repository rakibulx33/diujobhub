"use client";

import { EmployerLayout } from "@/components/layout/EmployerLayout";

export default function EmployerSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EmployerLayout>{children}</EmployerLayout>;
}
