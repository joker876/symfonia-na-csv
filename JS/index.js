import fs from "fs";
import fsExtra from 'fs-extra';
import iconv from "iconv-lite";
import path from "path";
import { jsonToCsv } from "./json-to-csv.js";
import { parseItem } from "./parse.js";

const fileName = "firmy_2";

const filePath = path.join(process.cwd(), `${fileName}.txt`);
const fileBuffer = fs.readFileSync(filePath);
const fileStr = iconv.decode(fileBuffer, "windows-1250");

const items = fileStr
  .split("\n}")
  .map((v) => v.trim())
  .filter(Boolean);

const itemMap = {};

// Process top-level items
for (const item of items) {
  const match = item.match(/^(.+)\{/);
  if (match) {
    const name = match[1].trim();
    const content = item.replace(name + "{", "").trim();
    if (!itemMap[name]) {
      itemMap[name] = [];
    }
    itemMap[name].push(parseItem(content));
  }
}

const csvMap = {};
for (const key in itemMap) {
  const value = itemMap[key];

  csvMap[key] = jsonToCsv(value);
}

for (const key in csvMap) {
  const value = csvMap[key];
  fsExtra.ensureDirSync(fileName)
  fs.writeFileSync(path.join(fileName, key + ".csv"), value);
}
