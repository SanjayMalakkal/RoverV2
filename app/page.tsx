"use client";

import React, { useState } from "react";
import { ChevronDown } from "@/components/Icons";
import HeroBanner from "@/components/HeroBanner";
import ReportCard from "@/components/ReportCard";
import ProjectDropdown from "@/components/ProjectDropdown";
import NewProjectModal from "@/components/NewProjectModal";

export default function Page() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const triggerId = "ev-title-trigger";

  const reportTypes = [
    "Competitor Analysis Report",
    "Industry Analysis Report",
    "Market Research Report",
    "Risk Analysis Report",
  ];

  const handleSelect = (report: string) => {
    // Toggle the selection: if clicked again, deselect
    setSelectedReport(selectedReport === report ? null : report);
  };

  return (
    <div className="px-5 md:px-8 lg:px-12 py-6">
      {/* Dropdown trigger */}
      <div className="relative flex items-center gap-3 mb-6">
        <button
          id={triggerId}
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-2 text-lg md:text-xl font-medium text-zinc-200 hover:text-white"
        >
          Electric Vehicles (EV) Market Report 2025–2035
          <ChevronDown
            className={`h-5 w-5 transition ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        <ProjectDropdown
          open={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
          onNewProject={() => {
            setDropdownOpen(false);
            setModalOpen(true);
          }}
          anchorId={triggerId}
        />
      </div>

      <HeroBanner
      selectedProject="Electric Vehicles (EV) Market Report 2025–2035"
      selectedReportType={selectedReport}
    />

      {/* Report type buttons */}
      <div className="flex flex-wrap gap-3 mt-5">
        {reportTypes.map((label) => {
          const isSelected = selectedReport === label;
          return (
            <button
              key={label}
              onClick={() => handleSelect(label)}
              className={`rounded-xl border px-4 py-2 text-sm transition-all
                ${
                  isSelected
                    ? "bg-brand.purple text-white border-brand.purple"
                    : "bg-zinc-900/60 border-white/10 hover:bg-zinc-900"
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <h2 className="mt-8 mb-3 text-sm text-zinc-300">My Reports</h2>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ReportCard key={i} />
        ))}
      </div>

      <NewProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={(payload) => {
          alert(`Project Created:\nTopic: ${payload.topic}\nAgent: ${payload.agent}`);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
