import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import svg2ttf from 'svg2ttf';
import ttf2woff from 'ttf2woff';
import ttf2woff2 from 'ttf2woff2';

const convertToTTF = async (pathToSVG) => {
  try {
    const ttfPath = `${path.dirname(pathToSVG)}/MaterialDings.ttf`;
    const svgFile = await readFile(pathToSVG, 'utf8');
    const ttf = svg2ttf(svgFile);
    await writeFile(ttfPath, Buffer.from(ttf.buffer));
    console.log('Successfully wrote dist/fonts/MaterialDings.ttf');
    return ttfPath;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

const convertToWOFF = async (pathToTTF) => {
  try {
    const ttfFile = await readFile(pathToTTF);
    const woff = ttf2woff(ttfFile);
    await writeFile(`${path.dirname(pathToTTF)}/MaterialDings.woff`, Buffer.from(woff.buffer));
    console.log('Successfully wrote dist/fonts/MaterialDings.woff');
    return pathToTTF;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

const convertToWOFF2 = async (pathToTTF) => {
  try {
    const ttfFile = await readFile(pathToTTF);
    const woff2 = ttf2woff2(ttfFile);
    await writeFile(`${path.dirname(pathToTTF)}/MaterialDings.woff2`, Buffer.from(woff2.buffer));
    console.log('Successfully wrote dist/fonts/MaterialDings.woff2');
    return pathToTTF;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

export { convertToTTF, convertToWOFF, convertToWOFF2 };