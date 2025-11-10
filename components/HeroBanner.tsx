"use client";
import React from "react";
import { Sparkles } from "./Icons";
import { useRouter } from "next/navigation";

interface Props {
  onCreate?: () => void;
  selectedProject?: string | null;
  selectedReportType?: string | null;
}

export default function HeroBanner({ selectedProject, selectedReportType }: Props) {
  const router = useRouter();

  const handleNavigate = () => {
    const params = new URLSearchParams();
    if (selectedProject) params.append("project", selectedProject);
    if (selectedReportType) params.append("reportType", selectedReportType);
    router.push(`/report-builder?${params.toString()}`);
  };

  return (
    <button
      onClick={handleNavigate}
      className="w-full rounded-2xl p-6 md:p-8 text-left transition-all
                 bg-gradient-to-r from-[#7C4DFF] via-[#8E5CF6] to-[#9D6EF4]
                 hover:opacity-90 focus:ring-2 focus:ring-[#7C4DFF]/50"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 text-white font-medium text-base md:text-lg">
          <Sparkles className="h-5 w-5" />
          <span>Create your E-Book</span>
        </div>
        <p className="text-sm text-white/90 sm:ml-3">
          Create a polished e-book from your research in seconds.
        </p>
      </div>
    </button>
  );
}
