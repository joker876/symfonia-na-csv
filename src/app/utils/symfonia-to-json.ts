export type SymfoniaItem = Record<string, any>;

export type SymfoniaMap = Record<string, SymfoniaItem[]>;

export function symfoniaToJson(input: string): SymfoniaMap {
  const items = input
    .split('\n}')
    .map((v) => v.trim())
    .filter(Boolean);

  const itemMap: SymfoniaMap = {};

  for (const item of items) {
    const match = item.match(/^(.+)\{/);
    if (match) {
      const name = match[1].trim();
      const content = item.replace(name + '{', '').trim();
      if (!itemMap[name]) {
        itemMap[name] = [];
      }
      itemMap[name].push(parseSingleItem(content));
    }
  }
  return itemMap;
}

function parseSingleItem(itemStr: string): SymfoniaItem {
  const result: SymfoniaItem = {};
  const lines = itemStr
    .split('\n')
    .map((v) => v.trim())
    .filter(Boolean);

  let currentKey = null;
  let nestedContent = '';
  let inNestedObject = false;

  for (const line of lines) {
    if (line.includes('{')) {
      // start nested object
      inNestedObject = true;
      const match = line.match(/^(.+)\{/);
      if (match) {
        currentKey = match[1].trim();
        nestedContent = '';
      }
      continue;
    }
    if (line === '}') {
      // end nested object
      inNestedObject = false;
      if (currentKey) {
        result[currentKey] = parseSingleItem(nestedContent);
        currentKey = null;
      }
      continue;
    }
    if (inNestedObject) {
      // accumulate lines for nested object
      nestedContent += line + '\n';
      continue;
    }
    // key-value pair
    const [key, value] = line.split('=').map((v) => v.trim());
    if (key && value) {
      const chunks = value.match(/.{1,50}/g) || []; // split long values
      chunks.forEach((chunk, index) => {
        if (index === 0) {
          result[key] = chunk; // first chunk without "_1"
        } else {
          result[`${key}_${index + 1}`] = chunk;
        }
      });
    }
  }
  return result;
}
