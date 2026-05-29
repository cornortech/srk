// Local-only cert preview for iterating layout — no DB, no email, no R2
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const NAME = 'Meena Chhetri';
const DATE = 'MAY 24, 2026';
const BATCH = 'B-2026';
const PARTICIPANT_ID = '258908';

// ── tweak these until it looks right ──────────────────────────────────────────
const NAME_Y = 455;
const NAME_SIZE = 36;
const FOOTER_Y = 183;   // y for date / batch / id values
const FOOTER_SIZE = 11;
const FONT_FILE = 'BrushScript.ttf';  // swap here to try other fonts
// ──────────────────────────────────────────────────────────────────────────────

async function preview() {
  const templatePath = path.join(
    process.cwd(), 'apps', 'backend', 'static', 'certificate', 'course-completion-certificate.pdf'
  );
  const fontPath = path.join(
    process.cwd(), 'apps', 'backend', 'static', 'fonts', FONT_FILE
  );
  const outPath = path.join(process.cwd(), '_cert-preview.pdf');

  const pdfBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const fontBytes = fs.readFileSync(fontPath);
  const scriptFont = await pdfDoc.embedFont(fontBytes);
  const regularFont = await pdfDoc.embedFont('Helvetica');

  const gold = rgb(212 / 255, 175 / 255, 55 / 255);

  const page = pdfDoc.getPages()[0];
  const { width } = page.getSize();

  // Name
  const nameW = scriptFont.widthOfTextAtSize(NAME, NAME_SIZE);
  console.log(`Name width at ${NAME_SIZE}px: ${nameW.toFixed(1)}  →  x: ${(width / 2 - nameW / 2).toFixed(1)}, y: ${NAME_Y}`);
  page.drawText(NAME, {
    x: width / 2 - nameW / 2,
    y: NAME_Y,
    size: NAME_SIZE,
    color: gold,
    font: scriptFont,
  });

  // Footer
  console.log(`Footer → Date x:135 y:${FOOTER_Y}  Batch x:360 y:${FOOTER_Y}  ID x:525 y:${FOOTER_Y}`);
  page.drawText(DATE,           { x: 135, y: FOOTER_Y, size: FOOTER_SIZE, color: rgb(1,1,1), font: regularFont });
  page.drawText(BATCH,          { x: 360, y: FOOTER_Y, size: FOOTER_SIZE, color: rgb(1,1,1), font: regularFont });
  page.drawText(PARTICIPANT_ID, { x: 525, y: FOOTER_Y, size: FOOTER_SIZE, color: rgb(1,1,1), font: regularFont });

  fs.writeFileSync(outPath, await pdfDoc.save());
  console.log(`\n✅ Preview saved: ${outPath}`);
}

preview().catch(console.error);
