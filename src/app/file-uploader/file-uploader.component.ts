import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as Papa from 'papaparse';

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
  selectedRow: any = null; 

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

  downloadSelectedTable() {
    if (!this.selectedRow) {
      alert('Please select a row to download');
      return;
    }
  
    const headers = this.getObjectKeys(this.selectedRow);
    const name = this.selectedRow['OwnerName'] || 'Неизвестный';
    const email = this.selectedRow['Username'] || 'Не указан';
  
    let content = `<html><body>`;
    content += `<p>Здравствуйте - <b>${name}</b>,</p>`;
    content += `<p>Его email: <b>${email}</b></p>`;
    content += `<p><b>Остальные данные:</b></p><ul>`;
  
    headers.forEach(header => {
      if (header !== 'OwnerName' && header !== 'Username') {
        content += `<li><b>${header}:</b> ${this.selectedRow[header]}</li>`;
      }
    });
  
    content += `</ul></body></html>`;
  
    const blob = new Blob(["\ufeff" + content], { type: 'application/msword;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'selected-user.doc';
    link.click();
  }
  
  selectRow(index: number) {
    this.selectedRow = this.csvData[index];
  }
}
