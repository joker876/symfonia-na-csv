import { Component, HostListener, inject, input } from '@angular/core';
import {
  ArdiumFilePipesModule,
  FileSystemMethod,
  FileSystemService,
} from '@ardium-ui/devkit';
import { ArdiumIconModule } from '@ardium-ui/ui';
import { PluralPipe } from '../../pipes/plural.pipe';
import { CsvFile } from '../../services/csv-file';

@Component({
  selector: 'app-file-display',
  standalone: true,
  imports: [ArdiumFilePipesModule, ArdiumIconModule, PluralPipe],
  templateUrl: './file-display.component.html',
  styleUrl: './file-display.component.scss',
})
export class FileDisplayComponent {
  readonly file = input.required<CsvFile>();

  private readonly fileSystem = inject(FileSystemService);

  @HostListener('click')
  onClick() {
    this.fileSystem.saveAs(this.file().data, {
      fileName: this.file().name + '.csv',
      method: FileSystemMethod.CrossBrowser,
    });
  }
}
