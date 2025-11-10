"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

const steps = [
  "Report Info",
  "Sections",
  "Add Reference",
  "Report Style",
  "Translations",
  "Review",
];

export default function ReportBuilderPage() {
  const searchParams = useSearchParams();
  const project = searchParams.get("project");
  const reportType = searchParams.get("reportType");

  // Step state
  const [activeStep, setActiveStep] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);

  const handleContinue = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 md:px-12 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => history.back()}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
        >
          ←
        </button>
        <h1 className="text-xl md:text-2xl font-semibold">
          Research about{" "}
          {project ? (
            <span className="text-brand-purple">{project}</span>
          ) : (
            "New Project"
          )}
        </h1>
      </div>

      {/* Layout */}
      <div className="grid md:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar */}
        <div className="space-y-4">
          <h3 className="text-sm text-zinc-400">
            {reportType ? reportType : "Market Research Report"}
          </h3>

          <div className="flex flex-col gap-3 mt-4">
            {steps.map((step, index) => (
              <button
                key={step}
                onClick={() => setActiveStep(index)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-all ${
                  activeStep === index
                    ? "bg-brand-purple/30 border border-brand-purple text-white"
                    : "bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                    activeStep === index
                      ? "bg-brand-purple text-white"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm">{step}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="card p-6 bg-zinc-900 border border-white/10 rounded-2xl">
          <StepContent
            step={activeStep}
            onContinue={handleContinue}
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
          />
        </div>
      </div>
    </div>
  );
}

/* -----------------------------------
 * Step content rendering
 * ----------------------------------- */
function StepContent({
  step,
  onContinue,
  selectedStyle,
  setSelectedStyle,
}: {
  step: number;
  onContinue: () => void;
  selectedStyle: number | null;
  setSelectedStyle: (index: number) => void;
}) {
  switch (step) {
    case 0:
      return (
        <div>
          <h2 className="text-lg font-semibold mb-6">Report Info</h2>

          <div className="mb-6">
            <label className="block text-sm mb-2 text-zinc-400">Title</label>
            <input
              type="text"
              placeholder="Write your Research topic / Report title here."
              className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2 text-zinc-400">
              Report Description
            </label>
            <textarea
              rows={4}
              placeholder="Briefly describe the purpose of your report..."
              className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm mb-2 text-zinc-400">Authors</label>
            <input
              type="text"
              placeholder="Robert D Boss"
              className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>

          <button
            onClick={onContinue}
            className="px-6 py-2 rounded-xl bg-brand-purple hover:bg-violet-600 text-white font-medium transition-all"
          >
            Continue
          </button>
        </div>
      );

    case 1:
      return <SectionsStep onContinue={onContinue} />;

    case 2:
      return (
        <div>
          <h2 className="text-lg font-semibold mb-6">Add Reference</h2>
          <p className="text-zinc-400 mb-4">
            Add reference links, citations, or source materials.
          </p>
          <textarea
            rows={4}
            placeholder="Paste reference URLs or notes here..."
            className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 outline-none focus:ring-2 focus:ring-brand-purple"
          />
          <div className="mt-8 flex justify-end">
            <button
              onClick={onContinue}
              className="px-6 py-2 rounded-xl bg-brand-purple hover:bg-violet-600 text-white font-medium transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      );

    case 3:
      return (
        <ReportStyleStep
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          onContinue={onContinue}
        />
      );

    case 4:
      return (
        <div>
          <h2 className="text-lg font-semibold mb-6">Translations</h2>
          <p className="text-zinc-400 mb-4">
            Choose languages you want your report translated into.
          </p>
          <select
            multiple
            className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
          </select>
          <div className="mt-8 flex justify-end">
            <button
              onClick={onContinue}
              className="px-6 py-2 rounded-xl bg-brand-purple hover:bg-violet-600 text-white font-medium transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      );

    case 5:
      return <ReviewStep selectedStyle={selectedStyle} />;

    default:
      return null;
  }
}

/* -----------------------------------
 * Step 2: Sections
 * ----------------------------------- */
function SectionsStep({ onContinue }: { onContinue: () => void }) {
  const allSections = [
    "Executive Summary",
    "Introduction",
    "Market Overview",
    "Findings and Analysis",
    "Competitive Landscape",
    "Opportunities and Challenges",
    "Conclusion",
  ];

  const [visibleSections, setVisibleSections] = useState<string[]>([
    allSections[0],
  ]);

  const handleAddSection = () => {
    if (visibleSections.length < allSections.length) {
      setVisibleSections(allSections.slice(0, visibleSections.length + 1));
    }
  };

  const allVisible = visibleSections.length === allSections.length;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">Sections</h2>
      <p className="text-zinc-400 mb-4">
        Add sections to structure your report. New sections will appear
        progressively as you add them.
      </p>

      <div className="flex flex-col gap-3">
        {visibleSections.map((section) => (
          <div
            key={section}
            className="flex items-center justify-between p-3 rounded-xl bg-zinc-800 border border-white/10"
          >
            <span>{section}</span>
            <Check className="h-4 w-4 text-emerald-400" />
          </div>
        ))}

        <button
          onClick={handleAddSection}
          disabled={allVisible}
          className={`mt-2 p-3 rounded-xl w-full border transition-all text-left ${
            allVisible
              ? "bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed"
              : "bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          {allVisible ? "All sections added" : "+ Add new section"}
        </button>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onContinue}
          className="px-6 py-2 rounded-xl bg-brand-purple hover:bg-violet-600 text-white font-medium transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

/* -----------------------------------
 * Step 4: Report Style
 * ----------------------------------- */
function ReportStyleStep({
  selectedStyle,
  setSelectedStyle,
  onContinue,
}: {
  selectedStyle: number | null;
  setSelectedStyle: (index: number) => void;
  onContinue: () => void;
}) {
  const themes = [
    "/themes/theme1.png",
    "/themes/theme2.png",
    "/themes/theme3.png",
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">Report Style</h2>
      <h3 className="text-sm text-zinc-400 mb-4">Select Theme</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themes.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedStyle(index)}
            className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition ${
              selectedStyle === index
                ? "border-brand-purple"
                : "border-transparent hover:border-white/20"
            }`}
          >
            <img
              src={img}
              alt={`Theme ${index + 1}`}
              className="w-full h-auto object-cover rounded-xl"
            />
            {selectedStyle === index && (
              <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1">
                <Check size={14} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onContinue}
          disabled={selectedStyle === null}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${
            selectedStyle === null
              ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
              : "bg-brand-purple hover:bg-violet-600 text-white"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

/* -----------------------------------
 * Step 5: Review
 * ----------------------------------- */
function ReviewStep({ selectedStyle }: { selectedStyle: number | null }) {
  const themes = [
    "/themes/theme1.png",
    "/themes/theme2.png",
    "/themes/theme3.png",
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="text-lg font-semibold mb-6">Review</h2>

      {selectedStyle !== null ? (
        <img
          src={themes[selectedStyle]}
          alt="Selected Theme"
          className="w-64 rounded-xl shadow-lg mb-6"
        />
      ) : (
        <p className="text-zinc-400 mb-6">
          No style selected. Please go back to choose a theme.
        </p>
      )}

      <h3 className="text-xl font-medium mb-2">Yayyy!</h3>
      <p className="text-zinc-400 mb-6">
        You're all set to create the report.
      </p>

      <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-brand-purple hover:bg-violet-600 text-white font-medium transition-all">
        Create Report
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
