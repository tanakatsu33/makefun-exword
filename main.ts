import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Bounty spec (program/v1, judged text): one line, 1-111 code points, a single word.
const MIN_CODE_POINTS = 1;
const MAX_CODE_POINTS = 111;

// The entry for "Describe Your Ex in One Word", built from its two halves:
const PREFIX = "Ex"; // the ex, sitting right at the front of the word
const REST = "communicated"; // ...formally cast out, no appeal
const ENTRY: string = PREFIX + REST; // "Excommunicated"

function validate(text: string): void {
  if (text.trim() === "") {
    throw new Error("Entry must not be empty or whitespace-only");
  }
  const length = [...text].length; // count code points, not UTF-16 units
  if (length < MIN_CODE_POINTS || length > MAX_CODE_POINTS) {
    throw new Error(
      `Entry must be ${MIN_CODE_POINTS}-${MAX_CODE_POINTS} code points, got ${length}`,
    );
  }
  if (/[\r\n\u2028\u2029]/.test(text)) {
    throw new Error("Entry must not contain line breaks");
  }
  if (/\s/.test(text)) {
    throw new Error("Entry must be a single word (no whitespace)");
  }
}

validate(ENTRY);

// Exactly one line: the entry plus a single trailing newline.
const content = ENTRY + "\n";
if (content.indexOf("\n") !== content.length - 1) {
  throw new Error("Output must be exactly one line");
}

const outputDir: string = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), content, "utf8");
