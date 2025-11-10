import React from "react";

interface ReportCardProps {
  title?: string;
  author?: string;
  img?: string;
}

export default function ReportCard({
  title = "Report Info",
  author = "EMERSON CALZONI",
  img,
}: ReportCardProps) {
  return (
    <div className="relative group">
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-fuchsia-500/20 via-purple-500/10 to-sky-500/20 aspect-[3/4]">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: img
              ? `url(${img})`
              : "radial-gradient(60% 60% at 30% 30%, rgba(124,77,255,.6), transparent), radial-gradient(50% 50% at 70% 70%, rgba(217,70,239,.6), transparent)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="card bg-zinc-900/80 p-4">
            <div className="text-sm">{title}</div>
            <div className="text-[11px] text-zinc-400 mt-1">{author}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
