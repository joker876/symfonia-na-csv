import { Component, inject } from '@angular/core';
import { ArdiumFileDropAreaModule } from '@ardium-ui/ui';
import { FileDisplayComponent } from './components/file-display/file-display.component';
import { FileReaderService } from './services/file-reader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ArdiumFileDropAreaModule, FileDisplayComponent],
  providers: [FileReaderService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly fileReaderService = inject(FileReaderService);

  onFileUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.fileReaderService.setFile(file);
  }
}
