import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import SVGIcons2SVGFont from 'svgicons2svgfont';
import svgpath from 'svgpath';

import definition from '../definition.json' assert { type: 'json' };

import mdi from '@mdi/js';
import svg from '../assets/icons.mjs';
const icons = { mdi, svg };

export default function generateSVGFont() {
  return new Promise((resolve, reject) => {
    const fontStream = new SVGIcons2SVGFont({
      fontHeight: 1000,
      fontName: 'MaterialDings',
      normalize: true
    });

    fontStream.pipe(fs.createWriteStream('dist/fonts/MaterialDings.svg'))
      .on('finish', () => {
        console.log('Successfully wrote dist/fonts/MaterialDings.svg');
        resolve(`${path.resolve()}/dist/fonts/MaterialDings.svg`);
      })
      .on('error', err => {
        console.error(err);
        reject(err);
      });

    Object.keys(definition.icons || {})
      .reduce((sourceIcons, unicode, i) => {
        const iconKey = definition.icons[unicode].icon.split(':');
        const iconSrc = iconKey[0];
        const name = iconKey[1];
        const pathData = icons[iconSrc][`${iconSrc}${name}`];

        if (!pathData) {
          console.warn('WARN: Unable to find path data for', name);
        }

        const { transform = [] } = definition.icons[unicode];

        const transformedPathData = transform.reduce((transformedPathData, tf) => {
          if (tf.type === 'rotate') {
            return transformedPathData.rotate(tf.value, 12, 12);
          }
          if (tf.type === 'scale') {
            const scale = (1 - tf.value) * 12;
            return transformedPathData.scale(tf.value).translate(scale, scale);
          }
          if (tf.type === 'flip') {
            const flipX = ['horizontal', 'both'].includes(tf.value);
            const flipY = ['vertical', 'both'].includes(tf.value);
            return transformedPathData.transform(`scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1}) translate(${flipX ? -24 : 0}, ${flipY ? -24 : 0})`);
          }
          return transformedPathData;
        }, svgpath(pathData || icons.mdi.mdiHelpRhombus)).toString();

        sourceIcons.push({
          name: `${name}-${i}`,
          path: transformedPathData,
          unicode
        });

        return sourceIcons;
      }, [])
      .forEach(icon => {
        const stream = new Readable;
        stream.push(`<svg viewBox='0 0 24 24'><path d='${icon.path}'/></svg>`);
        stream.push(null);

        stream.metadata = {
          name: icon.name,
          unicode: [icon.unicode]
        };

        fontStream.write(stream);
      });

    fontStream.end();
  });
};