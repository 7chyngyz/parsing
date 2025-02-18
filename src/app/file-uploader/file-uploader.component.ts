import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as Papa from 'papaparse';
import JSZip from 'jszip';

@Component({
  selector: 'app-csv-upload',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class CsvUploadComponent {
  csvData: any[] = [];
  protected file: any;
  selectedRows: any[] = [];

  constructor() {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.file = file;
  }

  startParsing() {
    if (!this.file) {
      alert('No file selected');
      return;
    }
    this.parseCSV(this.file);
  }

  parseCSV(file: File): void {
    Papa.parse(file, {
      complete: (result) => {
        this.csvData = result.data;
        console.log(this.csvData);
      },
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      delimiter: ',',
    });
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  generateWordContent(data: any): string {
    const headers = this.getObjectKeys(data);
    let content = `<html><body>`;

    const name = data['OwnerName'] || 'Неизвестный';
    const email = data['Username'] || 'Не указан';

    content += `<p>Здравствуйте - <b>${name}</b>,</p>`;
    content += `<p>Его email: <b>${email}</b></p>`;
    content += `<p><b>Остальные данные:</b></p><ul>`;

    headers.forEach(header => {
      if (header !== 'OwnerName' && header !== 'Username') {
        content += `<li><b>${header}:</b> ${data[header]}</li>`;
      }
    });

    content += `</ul><hr/></body></html>`;
    return content;
  }

  downloadSelectedAsZip() {
    if (this.selectedRows.length === 0) {
      alert('Please select at least one row to download');
      return;
    }

    const zip = new JSZip();
    
    this.selectedRows.forEach((row, index) => {
      const content = this.generateWordContent(row);
      zip.file(`user_${index + 1}.doc`, "\ufeff" + content, { binary: false });
    });

    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'selected-users.zip';
      link.click();
    });
  }

  toggleSelection(row: any) {
    const index = this.selectedRows.indexOf(row);
    if (index === -1) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows.splice(index, 1);
    }
  }

  toggleAllSelection(event: any) {
    if (event.target.checked) {
      this.selectedRows = [...this.csvData];
    } else {
      this.selectedRows = [];
    }
  }
}
