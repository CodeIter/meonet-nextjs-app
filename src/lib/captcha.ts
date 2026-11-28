
import { randomInt } from "crypto";
import sharp from "sharp";

export const CAPTCHA_FORMATS = ["jpeg", "png", "webp", "gif", "avif"] as const;
export type CaptchaFormat = (typeof CAPTCHA_FORMATS)[number];

export type RawValue = string | number | null | undefined;

export interface CaptchaGeneratorConfig {
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  defaultFormat: CaptchaFormat;
  defaultQuality: number;
  textLength: number;
  charset: string;
}

export interface CaptchaRenderInput {
  width?: RawValue;
  height?: RawValue;
  quality?: RawValue;
  format?: RawValue;
}

export interface CaptchaResolvedOptions {
  width: number;
  height: number;
  quality: number;
  format: CaptchaFormat;
}

export interface CaptchaResult {
  /** The answer. Store it server-side, never send it to the client. */
  text: string;
  buffer: Buffer;
  contentType: string;
  format: CaptchaFormat;
  width: number;
  height: number;
}

export class CaptchaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CaptchaValidationError";
  }
}

const DEFAULT_CONFIG: CaptchaGeneratorConfig = {
  defaultWidth: 200,
  defaultHeight: 80,
  minWidth: 80,
  maxWidth: 1000,
  minHeight: 30,
  maxHeight: 500,
  defaultFormat: "png",
  defaultQuality: 90,
  textLength: 6,
  // Visually ambiguous characters (0/O, 1/I/l) are excluded
  charset: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
};

/** Random float in [min, max). Used for cosmetic noise only. */
function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomColor(): string {
  const c = () => Math.floor(rand(0, 140)); // darker colours stay readable
  return `rgb(${c()},${c()},${c()})`;
}

export class CaptchaGenerator {
  static readonly MIME_TYPES: Readonly<Record<CaptchaFormat, string>> = {
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    avif: "image/avif",
  };

  private readonly config: CaptchaGeneratorConfig;

  constructor(config: Partial<CaptchaGeneratorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  static mimeTypeOf(format: CaptchaFormat): string {
    return CaptchaGenerator.MIME_TYPES[format];
  }

  /**
   * Validates raw input (for example, query-string values) and applies defaults.
   * Throws CaptchaValidationError when a value is invalid.
   */
  resolveOptions(input: CaptchaRenderInput = {}): CaptchaResolvedOptions {
    return {
      width: this.parseInteger(
        input.width,
        "width",
        this.config.defaultWidth,
        this.config.minWidth,
        this.config.maxWidth
      ),
      height: this.parseInteger(
        input.height,
        "height",
        this.config.defaultHeight,
        this.config.minHeight,
        this.config.maxHeight
      ),
      quality: this.parseInteger(input.quality, "quality", this.config.defaultQuality, 1, 100),
      format: this.parseFormat(input.format),
    };
  }

  /** Generates a captcha image and returns the answer together with the encoded image. */
  async render(input: CaptchaRenderInput = {}): Promise<CaptchaResult> {
    const options = this.resolveOptions(input);
    const text = this.generateText();
    const svg = this.buildSvg(text, options.width, options.height);
    const buffer = await this.encode(svg, options);

    return {
      text,
      buffer,
      contentType: CaptchaGenerator.mimeTypeOf(options.format),
      format: options.format,
      width: options.width,
      height: options.height,
    };
  }

  /** Cryptographically random answer text. */
  generateText(): string {
    const { charset, textLength } = this.config;
    let out = "";
    for (let i = 0; i < textLength; i++) {
      out += charset[randomInt(charset.length)];
    }
    return out;
  }

  /** Builds an SVG with noisy lines, dots, and rotated glyphs. */
  protected buildSvg(text: string, width: number, height: number): string {
    const fontSize = Math.floor(height * 0.55);
    const step = width / (text.length + 1);

    const lines = Array.from({ length: 5 }, () =>
      `<line x1="${rand(0, width)}" y1="${rand(0, height)}" x2="${rand(0, width)}" y2="${rand(0, height)}" stroke="${randomColor()}" stroke-width="${rand(1, 2.5)}" opacity="0.6"/>`
    ).join("");

    const dots = Array.from({ length: Math.floor(width / 4) }, () =>
      `<circle cx="${rand(0, width)}" cy="${rand(0, height)}" r="${rand(0.5, 1.5)}" fill="${randomColor()}" opacity="0.5"/>`
    ).join("");

    const glyphs = [...text]
      .map((ch, i) => {
        const x = step * (i + 1);
        const y = height / 2 + fontSize / 3 + rand(-height * 0.08, height * 0.08);
        const angle = rand(-25, 25);
        return `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="${fontSize}" fill="${randomColor()}" text-anchor="middle" transform="rotate(${angle} ${x} ${y})">${ch}</text>`;
      })
      .join("");

    // White background keeps formats without transparency (JPEG) from turning black
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  ${lines}
  ${dots}
  ${glyphs}
</svg>`;
  }

  /** Encodes the SVG with sharp. Quality applies to JPEG only. */
  protected async encode(svg: string, options: CaptchaResolvedOptions): Promise<Buffer> {
    const pipeline = sharp(Buffer.from(svg));

    switch (options.format) {
      case "jpeg":
        return pipeline.jpeg({ quality: options.quality }).toBuffer();
      case "png":
        return pipeline.png().toBuffer();
      case "webp":
        return pipeline.webp().toBuffer();
      case "gif":
        return pipeline.gif().toBuffer();
      case "avif":
        return pipeline.avif().toBuffer();
    }
  }

  private parseInteger(
    raw: RawValue,
    name: string,
    fallback: number,
    min: number,
    max: number
  ): number {
    if (raw === undefined || raw === null || raw === "") return fallback;

    let value: number;
    if (typeof raw === "number") {
      value = raw;
    } else if (/^\d+$/.test(raw)) {
      value = Number(raw);
    } else {
      throw new CaptchaValidationError(`${name} must be an integer.`);
    }

    if (!Number.isInteger(value) || value < min || value > max) {
      throw new CaptchaValidationError(`${name} must be between ${min} and ${max}.`);
    }
    return value;
  }

  private parseFormat(raw: RawValue): CaptchaFormat {
    if (raw === undefined || raw === null || raw === "") {
      return this.config.defaultFormat;
    }

    const normalized = String(raw).toLowerCase();
    const format = normalized === "jpg" ? "jpeg" : normalized;

    if ((CAPTCHA_FORMATS as readonly string[]).includes(format)) {
      return format as CaptchaFormat;
    }
    throw new CaptchaValidationError(
      `output must be one of: ${CAPTCHA_FORMATS.join(", ")}.`
    );
  }
}
