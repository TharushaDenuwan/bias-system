import { NextResponse } from "next/server";
import { execFile } from "child_process";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = body?.text;

    if (!text || typeof text !== "string" || text.trim().length < 5) {
      return NextResponse.json(
        {
          status: "error",
          message: "Valid Sinhala news text of at least 5 characters is required.",
        },
        { status: 400 }
      );
    }

    const trimmed = text.trim();

    // 1. Try backend microservice using URL configured in .env (NEXT_PUBLIC_BACKEND_URL)
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL;

    if (backendUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const endpoint = `${backendUrl.replace(/\/+$/, "")}/predict`;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && data.status === "success") {
            return NextResponse.json(data);
          }
        }
      } catch {
        // Fall back to direct Python invocation if microservice is unreachable
      }
    }

    // 2. Direct Python CLI execution fallback via temporary file (handles Unicode safely on Windows)
    const mlDir = path.resolve(process.cwd(), "..", "ml");
    const scriptPath = path.join(mlDir, "predict.py");
    const tempFile = path.join(
      os.tmpdir(),
      `bias_input_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.txt`
    );

    await fs.writeFile(tempFile, trimmed, "utf-8");

    try {
      const { stdout } = await execFileAsync(
        "python",
        [scriptPath, "--file", tempFile, "--json"],
        {
          cwd: mlDir,
          encoding: "utf-8",
          maxBuffer: 10 * 1024 * 1024,
        }
      );

      const parsed = JSON.parse(stdout);
      return NextResponse.json(parsed);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  } catch (err: any) {
    console.error("Bias prediction API error:", err);
    return NextResponse.json(
      {
        status: "error",
        message:
          err?.message ||
          "Failed to execute machine learning bias prediction pipeline. Please ensure models are trained.",
      },
      { status: 500 }
    );
  }
}
