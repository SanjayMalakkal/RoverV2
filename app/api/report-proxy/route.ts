import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log(">>> REPORT PROXY HIT");

  try {
    const body = await req.json();
    const workflow = body?.[0]?.workflow;

    const WORKFLOW_MAP: Record<string, string> = {
      Report_Info_Continue:
        "https://innov-dev.beta.injomo.com/workflow.trigger/",
      TryItNowButton:
        "https://innov-dev.beta.injomo.com/workflow.trigger/",
      AddToReport:
        "https://innov-dev.beta.injomo.com/workflow.trigger/",
    };

    // Resolve the workflow URL
    const workflowURL = WORKFLOW_MAP[workflow];

    if (!workflowURL) {
      return NextResponse.json(
        { error: `Unknown workflow: ${workflow}` },
        { status: 400 }
      );
    }

    // Forward the request to the correct workflow
    const response = await fetch(workflowURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to reach external API" },
      { status: 500 }
    );
  }
}
