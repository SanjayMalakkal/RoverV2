"use client";
import React from "react";
import { Sparkles } from "./Icons";
import { useRouter } from "next/navigation";

interface Props {
  selectedProject?: string | null;
  selectedReportType?: string | null;
}

export default function HeroBanner({
  selectedProject,
  selectedReportType,
}: Props) {
  const router = useRouter();

  const handleNavigate = async () => {
    try {
      // Workflow Payload
      const payload = [
        {
          identifier: "CreateReport",
          dna_filter_val: "f7cfed46-a054-4538-af43-4c04dbed48a8",
        },
      ];

      // Trigger Workflow
      const resp = await fetch(
        "/workflow.trigger/createreportsredirection6695103cc4d9d",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const raw = await resp.text();
      const json = JSON.parse(raw);

      const reportId = json[0]?.ReportID;

      if (!reportId) {
        console.error("ReportID missing in response:", json);
        alert("Failed to generate report.");
        return;
      }

      // Save ReportID globally
      localStorage.setItem("reportId", reportId);

      // Redirect to builder
      const params = new URLSearchParams();
      if (selectedProject) params.append("project", selectedProject);
      if (selectedReportType) params.append("reportType", selectedReportType);

      router.push(`/report-builder?${params.toString()}`);
    } catch (err) {
      console.error("WF error:", err);
      alert("Something went wrong while creating the report.");
    }
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
