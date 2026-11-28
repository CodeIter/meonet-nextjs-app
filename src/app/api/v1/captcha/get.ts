
import { NextRequest, NextResponse } from "next/server";
import { CaptchaGenerator, CaptchaValidationError } from "@/lib/captcha";

const captcha = new CaptchaGenerator();

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  try {
    const result = await captcha.render({
      width: searchParams.get("width"),
      height: searchParams.get("height"),
      quality: searchParams.get("quality"),
      format: searchParams.get("output"),
    });

    return new NextResponse(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        "Content-Type": result.contentType,
        "Content-Length": String(result.buffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof CaptchaValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Captcha generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate captcha." },
      { status: 500 }
    );
  }
}
