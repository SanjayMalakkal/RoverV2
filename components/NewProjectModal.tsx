"use client";

import React, { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: { topic: string; agent: string }) => void;
}

const agents = [
  { key: "market", name: "Market Research Accelerator", note: "Deep market intelligence" },
  { key: "competitive", name: "Competitive Intelligence Specialist", note: "Track competitors" },
  { key: "scenario", name: "Scenario Forecaster", note: "Project future scenarios" },
  { key: "ebook", name: "Smart E-book Maker", note: "Create professional e-books" },
  { key: "mna", name: "M&A Due Diligence Specialist", note: "Acquisition analysis" },
];

export default function NewProjectModal({ open, onClose, onCreate }: Props) {
  const [topic, setTopic] = useState("");
  const [agent, setAgent] = useState("market");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-2xl card">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Kickstart Your Project</h3>
          <p className="text-sm text-zinc-400 mb-4">Briefly describe your research topic</p>

          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="E.g., Artificial Intelligence in Healthcare"
            className="w-full rounded-xl bg-zinc-800/70 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-brand.purple"
          />

          <p className="mt-6 mb-3 text-sm text-zinc-300">Choose Your AI Agent</p>

          <div className="grid sm:grid-cols-2 gap-3">
            {agents.map((a) => (
              <button
                key={a.key}
                onClick={() => setAgent(a.key)}
                className={`text-left rounded-xl p-4 border ${
                  agent === a.key
                    ? "border-brand.purple ring-2 ring-brand.purple/40"
                    : "border-white/10"
                } bg-zinc-900/60 hover:bg-zinc-900`}
              >
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-zinc-400 mt-1">{a.note}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 border border-white/10 hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              onClick={() => onCreate({ topic, agent })}
              className="px-5 py-2 rounded-xl bg-brand.purple hover:bg-violet-600"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
