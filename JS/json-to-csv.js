export function jsonToCsv(jsonArray) {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
    throw new Error("Input must be a non-empty array of JSON objects.");
  }

  const rows = [];
  const headers = new Set();

  // Flatten a single object and collect headers
  function flattenObject(obj, prefix = "") {
    const flattened = {};

    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        // Recursively flatten nested objects
        Object.assign(flattened, flattenObject(obj[key], `${prefix}${key}.`));
      } else {
        // Add flat key-value pair
        flattened[`${prefix}${key}`] = obj[key];
        headers.add(`${prefix}${key}`);
      }
    }

    return flattened;
  }

  // Process each JSON object in the array
  for (const item of jsonArray) {
    const flattenedItem = flattenObject(item);
    rows.push(flattenedItem);
  }

  // Prepare headers and rows for CSV
  const headerArray = Array.from(headers);
  headerArray.sort(); // Sort headers by key name

  const csvRows = [headerArray.join(";")]; // Add header row

  for (const row of rows) {
    const csvRow = headerArray.map((header) =>
      row[header] !== undefined ? row[header] : ""
    );
    csvRows.push(csvRow.join(";"));
  }

  return csvRows.join("\n");
}
