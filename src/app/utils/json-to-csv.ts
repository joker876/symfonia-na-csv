import { json2csv } from "json-2-csv";


export function jsonToCsv(data: Record<string, any>[]): string {
  return json2csv(data, {
    delimiter: {
      field: ';',
    },
    excelBOM: true,
    expandNestedObjects: true,
    prependHeader: true,
    trimFieldValues: true,
    trimHeaderFields: true,
  })
}