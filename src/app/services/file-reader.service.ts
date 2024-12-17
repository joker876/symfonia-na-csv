import { inject, Injectable, signal } from '@angular/core';
import { FileSystemService } from '@ardium-ui/devkit';
import iconv from 'iconv-lite';
import { jsonToCsv } from '../utils/json-to-csv';
import { symfoniaToJson } from '../utils/symfonia-to-json';
import { CsvFile } from './csv-file';

@Injectable({
  providedIn: 'root',
})
export class FileReaderService {
  private readonly fileSystem = inject(FileSystemService);

  readonly csvFiles = signal<CsvFile[]>([]);
  readonly errorMsg = signal<string | null>(null);

  async setFile(file: File) {
    try {
      const buffer = await this.fileSystem.readFile(file, 'binary');
      if (!buffer) return;
      const win1250 = await iconv.decode(
        new Uint8Array(buffer),
        'windows-1250'
      );
      const symfoniaItems = symfoniaToJson(win1250);
      const csvFiles: CsvFile[] = [];

      for (const key in symfoniaItems) {
        const value = symfoniaItems[key];

        const csvData = jsonToCsv(value).replace(/undefined/g, '');

        const csvFile = new CsvFile(key, csvData, symfoniaItems[key].length);
        csvFiles.push(csvFile);
      }

      this.csvFiles.set(csvFiles);
    } catch (error: any) {
      this.errorMsg.set(error);
    }
  }
}
