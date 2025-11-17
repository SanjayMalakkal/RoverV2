"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState } from "react";
import { useEffect } from "react";
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
  return (
    <Suspense fallback={<div className="text-white p-6">Loading...</div>}>
      <ReportBuilderContent />
    </Suspense>
  );
}

function ReportBuilderContent() {
  const searchParams = useSearchParams();
  const project = searchParams.get("project");
  const reportType = searchParams.get("reportType");
  const [loadedReportId, setLoadedReportId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setprompt] = useState("");
  const [references, setReferences] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [finalReportId, setFinalReportId] = useState("");
  // const reportId = finalReportId || localStorage.getItem("reportId");


  const [activeStep, setActiveStep] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const [modalData, setModalData] = useState<{
    section: any;
    open: boolean;
  }>({
    section: null,
    open: false,
  });

  useEffect(() => {
    if (activeStep === 2) {
      handleReferenceWorkflow();
    }
  }, [activeStep]);

  useEffect(() => {
  const stored = localStorage.getItem("reportId");
  if (stored) {
    setLoadedReportId(stored);
  }
}, []);

const reportId = finalReportId || loadedReportId;


const handleContinue = async () => {
  try {
    let payload: any[] = [];
    let shortcode = "";
    let workflowId = "roverresearchreport6698ac68e953e";

    // STEP 0 → Report Info
    if (activeStep === 0) {
      shortcode = "reportinfo6694c7f7e8c3c";
      payload = [
        {
          scope: "",
          wid: workflowId,
          action: "next",
          follow: true,
          dna_filter_key: "ReportID",
          dna_filter_val: reportId,
          // app_filter: "ReportID::${reportId}",
          app_search: "",
          app_short_code: "injomo663331f2c5f00",
          Title: title,
          "Report Description": description,
          Authors: authors,
          shortcode,
        },
      ];
    }

    // STEP 1 → Sections
    if (activeStep === 1) {
      shortcode = "sections6694cb32de384";
      payload = [
        {
          scope: "",
          wid: workflowId,
          action: "next",
          follow: true,
          dna_filter_key: "ReportID",
          dna_filter_val: reportId,
          // app_filter: "ReportID::${reportId}",
          app_search: "",
          app_short_code: "injomo663331f2c5f00",
          shortcode,
        },
      ];
    }

    // STEP 2 → Add Reference
    if (activeStep === 2) {
      shortcode = "reference6694cb6ced907";
      payload = [
        {
          scope: "",
          wid: workflowId,
          action: "next",
          follow: true,
          dna_filter_key: "ReportID",
          dna_filter_val: reportId,
          // app_filter: "ReportID::${reportId}",
          app_search: "",
          app_short_code: "injomo663331f2c5f00",
          shortcode,
        },
      ];
    }

    // STEP 3 → Report Style
    if (activeStep === 3) {
      payload = [
        {
          wid: workflowId,
          follow: true,
          template: "template12",
          tag: "theme",
          status: true,
          reportId: reportId,
          shortcode: "reportstyle6694cbb269343",
        },
      ];
    }

    // CALL THE WORKFLOW
    const response = await fetch(`/workflow.trigger/${workflowId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("API error");
    await response.text();

    // MOVE TO NEXT STEP
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  } catch (error) {
    console.error("Error calling API:", error);
    alert("Error while calling API. Check console.");
  }
};

  const handleReferenceWorkflow = async () => {
    try {
      const payload = [
        {
          workflow: "Add_Reference",
          reportId: reportId,
          tag: "Referenece",
        },
      ];

      const response = await fetch(
        "/workflow.trigger/roverresearchreportdatafetch669f4eca89979",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const raw = await response.text();
      console.log("Reference workflow raw:", raw);

      const json = JSON.parse(raw);
      const parsedReferences = JSON.parse(json[0].Data);

      setReferences(parsedReferences);

    } catch (err) {
      console.error("Reference workflow error:", err);
    }
  };

const handleCreateEbook = async () => {
  try {
        const payload = [
      {
        reportid: reportId,  
        // projectId: projectId, 
        // tag: "create"
      }
    ];

    const response = await fetch(
      "/workflow.trigger/roverresearchreportredirecttopreview66c45d7168478",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const raw = await response.text();
    const json = JSON.parse(raw);

    const newReportId =
      json[0]?.ReportID ||
      json[0]?.ReportId ||
      json[0]?.reportID ||
      json[0]?.reportId ||
      json[0]?.reportid;

    setFinalReportId(newReportId);
    localStorage.setItem("reportId", newReportId);

    setFinalReportId(newReportId);
    localStorage.setItem("reportId", newReportId);

    localStorage.removeItem("sectionIds");
    window.dispatchEvent(new Event("reset-section-ids"));

  } catch (err) {
    console.error("Create Ebook Error:", err);
    alert("Failed to create ebook.");
  }
};


const onCreateEbookPreview = async () => {
  try {
    // ✅ Use correct ReportID
    const reportId = finalReportId || loadedReportId;

    if (!reportId) {
      console.error("Preview Error: No reportId available", {
        finalReportId,
        loadedReportId,
      });
      return;
    }

    const payload = [
      {
        ReportID: reportId,
      },
    ];

    const response = await fetch(
      "/workflow.trigger/sanjaytest66ed4729d7a7e",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const raw = await response.text();
    const json = JSON.parse(raw);

    const sectionsArray = JSON.parse(json[0].Data || "[]");

    const cleanedSections = sectionsArray.map((item) => ({
      section: item.Sections,
      content: (item.Content || "").replace(/<[^>]+>/g, "").trim(),
    }));

    setEditorContent(cleanedSections);
    setShowEditor(true);

  } catch (e) {
    console.error("Preview workflow failed", e);
  }
};




if (showEditor) {
  return (
    <EditorView
      content={editorContent}
      onBack={() => setShowEditor(false)}
    />
  );
}

  return (
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
              onClick={() => {
                setActiveStep(index);      
              }}
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
            references={references}
            handleCreateEbook={handleCreateEbook}
            onCreateEbookPreview={onCreateEbookPreview}
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
  setAuthors,
  references,
  handleCreateEbook,
  onCreateEbookPreview,
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
  references: any[];
  handleCreateEbook: () => void;
  onCreateEbookPreview: () => void;
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
          <div className="flex flex-col gap-4">
          {references.map((ref, idx) => (
            <input
              key={ref.ReferenceID}
              type="text"
              value={ref.Reference}
              readOnly
              onClick={() => console.log("Clicked", ref)}
              className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 
                        outline-none cursor-pointer hover:bg-zinc-700 transition"
            />
          ))}
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
          <ReviewStep
            selectedStyle={selectedStyle}
            onCreateEbook={handleCreateEbook}
            onCreateEbookPreview={onCreateEbookPreview}
          />
        );

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
  { id: "b8f3c2f1-3c1a-4c1f-bc32-2db8d911e342", name: "Executive Summary" },
  { id: "19cfe1b3-2c34-458e-862e-8134cb1a05a9", name: "Introduction" },
  { id: "2c7b4adb-6e11-4c03-b5c4-011d5e67b55f", name: "Market Overview" },
  { id: "3df7e9a8-9e0b-4e49-a1c1-6e6d52e3ac08", name: "Findings and Analysis" },
  { id: "fc6fa09b-f749-4462-966b-efdd69ef3821", name: "Competitive Landscape" },
  { id: "e11a9edc-9f2e-4e08-bb4b-60b2d81e2e1f", name: "Opportunities and Challenges" },
  { id: "a24f8070-a18e-41c8-beb7-671478e6f248", name: "Conclusion" },
];

const [sectionIds, setSectionIds] = useState({});

useEffect(() => {
  // Load from localStorage on mount
  const saved = localStorage.getItem("sectionIds");
  if (saved) setSectionIds(JSON.parse(saved));

  // Listen for reset event from parent
  const clearIds = () => setSectionIds({});
  window.addEventListener("reset-section-ids", clearIds);

  return () => window.removeEventListener("reset-section-ids", clearIds);
}, []);


const [visibleSections, setVisibleSections] = useState([allSections[0]]);

  const handleAddSection = () => {
    if (visibleSections.length < allSections.length) {
      setVisibleSections(allSections.slice(0, visibleSections.length + 1));
    }
  };

  const globalReportId =
  typeof window !== "undefined" ? localStorage.getItem("reportId") : null;

  useEffect(() => {
  const currentReport = localStorage.getItem("reportId");
  const lastReport = localStorage.getItem("lastReportId");

  if (currentReport !== lastReport) {
    // new report created
    setSectionIds({});
    localStorage.setItem("sectionIds", JSON.stringify({}));
    localStorage.setItem("lastReportId", currentReport);
  }
}, [globalReportId]);

const projectId = typeof window !== "undefined"
  ? new URLSearchParams(window.location.search).get("project")
  : null;

const handleSectionClick = async (section: { id: string; name: string }) => {
  try {
    const hasSavedId = sectionIds[section.name];

    const payload = [
      {
        ReportId: globalReportId,
        ProjectId: projectId,
        tag: hasSavedId ? "edit" : "new",
        ...(hasSavedId ? { sectionId: hasSavedId } : {})
      }
    ];

    // call workflow
    const response = await fetch(
      "/workflow.trigger/roverresearchreportsectionpopup66b9d41f6a159",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const raw = await response.text();
    const json = JSON.parse(raw);

    const workflowSection = json[0];

    // if NEW, store the generated SectionID
    if (workflowSection.tag === "new" && workflowSection.SectionID) {
      setSectionIds((prev) => {
        const updated = { ...prev, [section.name]: workflowSection.SectionID };
        localStorage.setItem("sectionIds", JSON.stringify(updated));
        return updated;
      });
    }

    setModalData({
      section: {
        ...section,
        id: hasSavedId || workflowSection.SectionID, // dynamic
        content: workflowSection.Content || "",
        prompt: workflowSection.Prompt || "",
      },
      open: true,
    });

  } catch (err) {
    console.error("Section popup error:", err);
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
            key={section.id}
            onClick={() => handleSectionClick(section)}
            className="flex items-center justify-between p-3 rounded-xl bg-zinc-800 border border-white/10 hover:bg-zinc-700 transition-all"
          >
            <span>{section.name}</span>
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
  section: { id: string; name: string; content?: string; prompt?: string };
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState(section.content || "");
  const [hideSuggestions, setHideSuggestions] = useState(!!section.content);
  const [textareaValue, setTextareaValue] = useState(section.prompt || "");
  const globalReportId =
  typeof window !== "undefined"
    ? localStorage.getItem("reportId")
    : null;

  // NEW STATE — store values from WF-A response
  const [reportId, setReportId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const [jobIdValue, setJobIdValue] = useState("");

  const suggestions = [
    `Write a ${section.name} that provides a clear overview of the topic and incorporates the significant findings from the research.`,
    `Write a ${section.name} chapter that provides an overview of the topic and incorporates a brief summary of the key findings from the study.`,
    `Write a ${section.name} that focuses on summarizing the key findings succinctly and setting the stage for the detailed analysis that follows.`,
    `Write a ${section.name} paragraph that presents the research focus and includes a summary of the important conclusions from the study.`,
  ];

  const handleTryNow = async () => {
    if (!textareaValue.trim()) return;

    setHideSuggestions(true);
    setIsLoading(true);

    try {
      const payloadA = [
        {
          workflow: "TryItNowButton",
          step: "chapter-generate",
          section: section.name,
          sectionID: section.id,
          promt: textareaValue,
          ReportID: globalReportId,
          // sectionID: "5dbf1989-ff49-46d4-84b6-4e70fc0f014c",
          tag: section.id ? "edit" : "new",
        },
      ];

      const genResponse = await fetch(
        "/workflow.trigger/roverresearchreportreportgenerate66a10d164c6ad",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadA),
        }
      );

      const genJson = JSON.parse(await genResponse.text());
      const wfParams = genJson[0].workflowParameters?.[0];

      setJobIdValue(genJson[0].jobId || "");
      setReportId(wfParams?.ReportID || "");
      setSectionId(wfParams?.SectionID || "");
      setTitleValue(wfParams?.Title || "");

      await new Promise((resolve) => setTimeout(resolve, 10000));

      const payloadB = [
        {
          jobId: genJson[0].jobId,
          Section: section,
        },
      ];

      const contentResp = await fetch(
        "/workflow.trigger/roverresearchreportshowcontent670668ab24679",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadB),
        }
      );

      const contentJson = JSON.parse(await contentResp.text());
      setGeneratedText(contentJson[0].Content || "");

    } catch (err) {
      console.error("Error:", err);
      setGeneratedText("Failed to generate content.");
    }

    setIsLoading(false);
  };

  const handleAddToReport = async () => {
    const payload = [
      {
        follow: true,
        wid: "roverresearchreportsavesection66ba04fb7222c",
        ReportID: globalReportId,
        shortcode: "review6694cbea9a82f",

        promt: textareaValue, 

        sectionID: section.id,
        title: section.name,
        tag: "edit",

        jobid: jobIdValue,
      },
    ];

    try {
      await fetch(
        "/workflow.trigger/roverresearchreportsavesection66ba04fb7222c",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save section.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 text-zinc-100 rounded-xl shadow-2xl 
        w-full max-w-3xl max-h-[90vh] flex flex-col border border-white/10 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Chapter Details</h2>
          <button className="text-zinc-400 hover:text-white" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
          <input
            type="text"
            value={section.name}
            readOnly
            className="w-full p-3 rounded-md bg-zinc-800 border border-white/10"
          />

          {/* Textarea + Try Now */}
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <textarea
              rows={3}
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              placeholder={`Provide an overview for ${section.name.toLowerCase()}...`}
              className="flex-1 p-3 rounded-md bg-zinc-800 border border-white/10"
            />

            <button
              onClick={handleTryNow}
              disabled={isLoading}
              className={`px-5 py-2 rounded-md ${
                isLoading
                  ? "bg-zinc-700 text-zinc-400"
                  : "bg-purple-700 hover:bg-purple-800 text-white"
              }`}
            >
              {isLoading ? "Generating..." : "Try it now"}
            </button>
          </div>

          {/* Suggestions */}
          {!hideSuggestions && !generatedText && (
            <div className="border border-white/10 rounded-md p-4 bg-zinc-800/50">
              <h3 className="text-sm font-medium mb-4">Try this descriptions</h3>
              <div className="space-y-3">
                {suggestions.map((desc, i) => (
                  <button
                    key={i}
                    onClick={() => setTextareaValue(desc)}
                    className="w-full text-left p-3 rounded-md bg-zinc-900 border border-white/10 hover:bg-purple-900/40"
                  >
                    {desc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loader */}
          {isLoading && (
            <div className="flex flex-col items-center py-10">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-zinc-400 mt-3">Generating your chapter...</p>
            </div>
          )}

          {/* Generated content */}
          {generatedText && !isLoading && (
            <div
              className="rounded-md p-5 bg-purple-950/30 border border-purple-700"
              dangerouslySetInnerHTML={{ __html: generatedText }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-zinc-950 flex justify-end shrink-0">
          <button
            onClick={handleAddToReport}
            className="px-6 py-2 rounded-md bg-purple-700 hover:bg-purple-800 text-white"
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
  const themes = [
  "https://static.vizru.com/rover/report/template13.jpg",
  "https://static.vizru.com/rover/report/template9.jpg",
  "https://static.vizru.com/rover/report/template11.jpg",
  

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
function ReviewStep({
  selectedStyle,
  onCreateEbook,
  onCreateEbookPreview,
}: {
  selectedStyle: number | null;
  onCreateEbook: () => void;
  onCreateEbookPreview: () => void;
}){
  const themes = ["https://static.vizru.com/rover/report/template13.jpg", "https://static.vizru.com/rover/report/template9.jpg", "https://static.vizru.com/rover/report/template11.jpg"];

  // NEW STATES
  const [isCreating, setIsCreating] = useState(false);
  const [buttonText, setButtonText] = useState("Create Report");

  const handleClick = async () => {
    if (buttonText === "Create Report") {
      setIsCreating(true);
      setButtonText("Loading...");

      await onCreateEbook();

      setTimeout(() => {
        setIsCreating(false);
        setButtonText("View E-book");
      }, 3000);
    } else {
      await onCreateEbookPreview();
    }
  };

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

      <button
        onClick={handleClick}
        disabled={isCreating}
        className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all ${
          isCreating
            ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
            : "bg-brand-purple hover:bg-violet-600 text-white"
        }`}
      >
        {buttonText}
        {!isCreating && <ArrowRight size={16} />}
      </button>
    </div>
  );
}

function EditorView({
  content,
  onBack,
}: {
  content: { section: string; content: string }[];
  onBack: () => void;
}) {
  const [sectionsData, setSectionsData] = useState(content);
  const [showDropdown, setShowDropdown] = useState(false);

  const reportId =
    typeof window !== "undefined"
      ? localStorage.getItem("reportId")
      : null;

  const handleUpdate = (index: number, value: string) => {
    const updated = [...sectionsData];
    updated[index].content = value;
    setSectionsData(updated);
  };

  const makePayload = (tag: string) =>
    JSON.stringify([
      {
        ReportID: reportId,  
        Sections: sectionsData,
        tag, 
      },
    ]);


  const handleExportPDF = () => {
    fetch("/workflow.trigger/roverresearchreportcreatepdf669e5b20c53ee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: makePayload("pdf"),
    });
  };

  const handleExportWord = () => {
    fetch("/workflow.trigger/roverresearchreportcreatepdf669e5b20c53ee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: makePayload("docx"),
    });
  };

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white px-10 py-8">

      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700"
      >
        ← Back
      </button>

      {/* Header Buttons */}
      <div className="flex justify-end mb-6 relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="px-6 py-2 bg-brand-purple rounded-xl hover:bg-violet-600 shadow-md"
        >
          Generate Report ▼
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 bg-zinc-800 border border-white/10 rounded-xl shadow-xl w-52 overflow-hidden z-50">
            <button
              onClick={handleExportPDF}
              className="block w-full px-4 py-2 text-left hover:bg-zinc-700"
            >
              Export as PDF
            </button>

            <button
              onClick={handleExportWord}
              className="block w-full px-4 py-2 text-left hover:bg-zinc-700"
            >
              Export as Word
            </button>
          </div>
        )}
      </div>

      {/* Editable Sections */}
      <div className="space-y-10">
        {sectionsData.map((sec, index) => (
          <div
            key={index}
            className="bg-zinc-800 border border-white/10 p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4 tracking-wide">
              {sec.section}
            </h2>

            <div
              ref={(el) => {
                if (el && el.innerText !== sectionsData[index].content) {
                  el.innerText = sectionsData[index].content;
                }
              }}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => handleUpdate(index, e.currentTarget.innerText)}
              className="w-full min-h-[120px] text-[15px] leading-relaxed
                        p-4 rounded-xl bg-zinc-900 border border-white/10
                        focus:outline-none focus:ring-2 focus:ring-brand-purple
                        prose prose-invert"
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}




