"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState } from "react";
import { Check, ArrowRight, X, Workflow } from "lucide-react";
import { title } from "process";

const steps = [
  "Report Info",
  "Sections",
  "Add Reference",
  "Report Style",
  "Review",
];

export default function ReportBuilderPage() {
  const searchParams = useSearchParams();
  const project = searchParams.get("project");
  const reportType = searchParams.get("reportType");
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setprompt] = useState("");

  const [activeStep, setActiveStep] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const [modalData, setModalData] = useState<{ section: string; open: boolean }>({
    section: "",
    open: false,
  });

const handleContinue = async () => {
  try {
    const payload = [
      {
        workflow: "Report_Info_Continue",
        step: activeStep,
        project,
        reportType,
        Title: title,                 
        Authors: authors,           
        "Report Description": description,
        wid: "roverresearchreport6698ac68e953e",
        action: "next",
        follow: true,
        shcode: "reportinfo6694c7f7e8c3c",
        dna_filter_key: "ReportID",
        dna_filter_val: "6718e846-6c6b-4577-9f09-2ce63a9a4124",
        app_filter: "ReportID::6718e846-6c6b-4577-9f09-2ce63a9a4124",
        app_search: "",
        app_short_code: "injomo663331f2c5f00",
        shortcode: "reportinfo6694c7f7e8c3c ",
      },
    ];

    const response = await fetch("/workflow.trigger/roverresearchreport6698ac68e953e", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    console.log("Raw response body:", text);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = JSON.parse(text);
    console.log("Proxy API Response:", result);

    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  } catch (error) {
    console.error("Error calling API:", error);
    alert("Something went wrong while connecting to the server. Check console for details.");
  }
};

  return (
    <Suspense fallback={<div className="text-white p-6">Loading...</div>}>

    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 md:px-12 py-8 relative overflow-visible">
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
      <div className="grid md:grid-cols-[280px_1fr] gap-8 relative overflow-visible">
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
        <div className="card p-6 bg-zinc-900 border border-white/10 rounded-2xl relative overflow-visible">
          <Suspense fallback={<div>Loading report builder…</div>}>
          <StepContent
            step={activeStep}
            onContinue={handleContinue}
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            setModalData={setModalData}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            authors={authors}
            setAuthors={setAuthors}
          />
          </Suspense>
        </div>
      </div>

      {/* Global Modal rendered at root level */}
      {modalData.open && (
        <ChapterModal
          section={modalData.section}
          onClose={() => setModalData({ section: "", open: false })}
        />
      )}
    </div>
    </Suspense>
  );
}

/* -----------------------------------
 * Step Content
 * ----------------------------------- */
function StepContent({
  step,
  onContinue,
  selectedStyle,
  setSelectedStyle,
  setModalData,
  title,
  setTitle,
  description,
  setDescription,
  authors,
  setAuthors
}: {
  step: number;
  onContinue: () => void;
  selectedStyle: number | null;
  setSelectedStyle: (index: number) => void;
  setModalData: (data: { section: string; open: boolean }) => void;
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  authors: string;
  setAuthors: (v: string) => void;
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm mb-2 text-zinc-400">Authors</label>
            <input
              type="text"
              placeholder="Robert D Boss"
              className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 outline-none focus:ring-2 focus:ring-brand-purple"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={onContinue}
              className="px-6 py-2 rounded-xl bg-brand-purple hover:bg-violet-600 text-white font-medium transition-all flex"
            >
              Continue
            </button>
          </div>
        </div>
      );

    case 1:
      return <SectionsStep onContinue={onContinue} setModalData={setModalData} />;

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
      return <ReviewStep selectedStyle={selectedStyle} />;

    default:
      return null;
  }
}

/* -----------------------------------
 * Step 2: Sections
 * ----------------------------------- */
function SectionsStep({
  onContinue,
  setModalData,
}: {
  onContinue: () => void;
  setModalData: (data: { section: string; open: boolean }) => void;
}) {
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
        Add sections to structure your report. Click on a section to edit its
        details.
      </p>

      <div className="flex flex-col gap-3 relative overflow-visible">
        {visibleSections.map((section) => (
          <button
            key={section}
            onClick={() => setModalData({ section, open: true })}
            className="flex items-center justify-between p-3 rounded-xl bg-zinc-800 border border-white/10 hover:bg-zinc-700 transition-all"
          >
            <span>{section}</span>
          </button>
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

      <div className="mt-8 flex justify-center">
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
 * Modal (Now Global)
 * ----------------------------------- */
function ChapterModal({
  section,
  onClose,
}: {
  section: string;
  onClose: () => void;
}) {
  const [textareaValue, setTextareaValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  const suggestions = [
    `Write a ${section} that provides a clear overview of the topic and incorporates the significant findings from the research.`,
    `Write a ${section} chapter that provides an overview of the topic and incorporates a brief summary of the key findings from the study.`,
    `Write a ${section} that focuses on summarizing the key findings succinctly and setting the stage for the detailed analysis that follows.`,
    `Write a ${section} paragraph that presents the research focus and includes a summary of the important conclusions from the study.`,
  ];

  const handleTryNow = async () => {
    if (!textareaValue.trim()) return;

    setIsLoading(true);
    setResultVisible(false);

    // Prepare payload same as handleContinue()
    const payload = [
      {
        workflow: "TryItNowButton",
        step: "chapter-generate",
        section: section,
        promt: textareaValue,
        ReportID: "6718e846-6c6b-4577-9f09-2ce63a9a4124",
        sectionID: "5dbf1989-ff49-46d4-84b6-4e70fc0f014c",
        tag: "edit",
      }
    ];

    try {
      const response = await fetch("workflow.trigger/roverresearchreportreportgenerate66a10d164c6ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log("Raw response body:", text);

      if (!response.ok) throw new Error("API failed");

      const result = JSON.parse(text);

      // Show generated content
      setGeneratedText(result.data || "No response received.");

    } catch (err) {
      console.error("Error:", err);
      setGeneratedText("Something went wrong while generating the chapter.");
    }

    setIsLoading(false);
    setResultVisible(true);
  };


  const handleAddToReport = async () => {
  const payload = [
    {
      workflow: "AddToReport",
      step: "chapter-save",
      data: {
        section,
        content: generatedText || textareaValue,
      },
    },
  ];

  try {
    const response = await fetch("workflow.trigger/roverresearchreportreportgenerate66a10d164c6ad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const raw = await response.text();
    console.log("Add-to-report response:", raw);

    if (!response.ok) throw new Error("Save failed");

    onClose(); // Close modal after saving
  } catch (err) {
    alert("Failed to save section. Check console.");
    console.error(err);
  }
};

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 text-zinc-100 rounded-xl shadow-2xl w-[95%] max-w-3xl min-h-[70vh] flex flex-col border border-white/10 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Chapter Details</h2>
          <button
            className="text-zinc-400 hover:text-white transition"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section name */}
          <input
            type="text"
            value={section}
            readOnly
            className="w-full p-3 rounded-md bg-zinc-800 text-white border border-white/10 outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Textarea and Try button */}
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <textarea
              rows={3}
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              placeholder={`Provide an overview for ${section.toLowerCase()}...`}
              className="flex-1 p-3 rounded-md bg-zinc-800 text-white border border-white/10 focus:ring-2 focus:ring-purple-500 outline-none resize-none placeholder-zinc-400"
            />
            <button
              onClick={handleTryNow}
              disabled={isLoading}
              className={`px-5 py-2 rounded-md font-medium transition ${
                isLoading
                  ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                  : "bg-purple-700 hover:bg-purple-800 text-white"
              }`}
            >
              {isLoading ? "Generating..." : "Try it now"}
            </button>
          </div>

          {/* Loader */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-zinc-400 mt-3">
                Generating your chapter...
              </p>
            </div>
          )}

          {/* Generated Result */}
          {resultVisible && (
            <div className="rounded-md p-5 bg-purple-950/30 border border-purple-700">
              <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                {generatedText}
              </p>
            </div>
          )}

          {/* Try this descriptions */}
          {!isLoading && !resultVisible && (
            <div className="border border-white/10 rounded-md p-4 bg-zinc-800/50">
              <h3 className="text-sm font-medium text-zinc-300 mb-4">
                Try this descriptions
              </h3>
              <div className="space-y-3">
                {suggestions.map((desc, i) => (
                  <button
                    key={i}
                    onClick={() => setTextareaValue(desc)}
                    className="w-full text-left p-3 rounded-md border border-white/10 bg-zinc-900 hover:bg-purple-900/40 transition text-sm text-zinc-200 leading-relaxed"
                  >
                    {desc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          {!isLoading && (
            <div className="border-t border-white/10 pt-3 text-sm text-zinc-400">
              Result Based on{" "}
              <span className="font-semibold text-white">My Insight</span>
            </div>
          )}
        </div>

        {/* Footer button */}
        <div className="p-4 border-t border-white/10 bg-zinc-950 flex justify-end">
          <button
            onClick={handleAddToReport}
            className="px-6 py-2 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-medium transition"
          >
            Add to report
          </button>
        </div>
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
  const themes = ["/themes/theme1.png", "/themes/theme2.png", "/themes/theme3.png"];
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
  const themes = ["/themes/theme1.png", "/themes/theme2.png", "/themes/theme3.png"];
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
