// Notes From a Passive-Aggressive Fridge
// Writes one note to /output/entry.txt. Node 22, standard library only.
// Deterministic: the note is a constant, so every run writes identical bytes.
import { mkdirSync, writeFileSync } from "node:fs";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;

const NOTE =
  "Day 41: the yogurt has a name now. Greg. He's settled, the ice maker approves, and he remains the only thing in here you've ever committed to.";

// The gate: UTF-8 text of 1 to 200 characters, not only white space.
// Check it here so the program fails loudly rather than writing an invalid entry.
function assertGate(note: string): void {
  const chars = [...note]; // code points, not UTF-16 units
  if (chars.length < 1 || chars.length > MAX_CHARS) {
    throw new Error(`note is ${chars.length} code points, gate allows 1..${MAX_CHARS}`);
  }
  if (chars.every((c) => /\s/.test(c))) {
    throw new Error("note is white space only");
  }
  for (const c of chars) {
    if (c.codePointAt(0)! > 0x10ffff || (c >= "\ud800" && c <= "\udfff")) {
      throw new Error("note is not valid UTF-8 text");
    }
  }
}

assertGate(NOTE);
mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, NOTE, "utf8"); // exact note bytes, no trailing newline
