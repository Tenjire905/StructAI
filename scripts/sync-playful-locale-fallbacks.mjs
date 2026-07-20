import fs from 'node:fs';

const deContent = fs.readFileSync('data/lessonContent/de.ts', 'utf8');
const playfulKeys = [...deContent.matchAll(/'([^']+\.playful)':/g)].map((match) => match[1]);

function extractValue(content, key) {
  const singleQuote = `'${key}': '`;
  const singleStart = content.indexOf(singleQuote);

  if (singleStart >= 0) {
    let index = singleStart + singleQuote.length;
    let value = '';

    while (index < content.length) {
      const char = content[index];

      if (char === '\\') {
        value += content.slice(index, index + 2);
        index += 2;
        continue;
      }

      if (char === "'") {
        return `'${value.replace(/'/g, "\\'")}'`;
      }

      value += char;
      index += 1;
    }
  }

  const backtickPrefix = `'${key}': \``;
  const backtickStart = content.indexOf(backtickPrefix);

  if (backtickStart >= 0) {
    let index = backtickStart + backtickPrefix.length;
    let value = '';

    while (index < content.length) {
      const char = content[index];

      if (char === '\\') {
        value += content.slice(index, index + 2);
        index += 2;
        continue;
      }

      if (char === '`') {
        return `\`${value}\``;
      }

      value += char;
      index += 1;
    }
  }

  return null;
}

for (const localeFile of ['en_pb.ts', 'fr_pb.ts', 'ru_pb.ts']) {
  const path = `data/lessonContent/${localeFile}`;
  let content = fs.readFileSync(path, 'utf8');
  const additions = [];

  for (const playfulKey of playfulKeys) {
    if (content.includes(`'${playfulKey}':`)) {
      continue;
    }

    const baseKey = playfulKey.replace(/\.playful$/, '');
    const value = extractValue(content, baseKey);

    if (!value) {
      console.warn(`Missing base for ${playfulKey} in ${localeFile}`);
      continue;
    }

    additions.push(`  '${playfulKey}': ${value},`);
  }

  if (additions.length > 0) {
    content = content.replace(/\n};\s*$/, `\n${additions.join('\n')}\n};\n`);
    fs.writeFileSync(path, content);
    console.log(`${localeFile}: added ${additions.length} playful keys (focus fallback)`);
  }
}
