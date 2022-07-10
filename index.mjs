import generateSVGFont from './lib/generateSVGFont.mjs';
import { convertToTTF, convertToWOFF, convertToWOFF2 } from './lib/convertFont.mjs';

try {
  const svgFont = await generateSVGFont();
  const ttfFont = await convertToTTF(svgFont);
  await convertToWOFF(ttfFont);
  await convertToWOFF2(ttfFont);
} catch (e) {
  console.error(e);
}
