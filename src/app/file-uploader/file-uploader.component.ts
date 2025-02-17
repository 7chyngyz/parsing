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

  downloadAllTable() {
    if (this.csvData.length === 0) {
      alert('No data available to download');
      return;
    }
  
    const headers = this.getObjectKeys(this.csvData[0]);
    let content = `<html><body>`;
  
    this.csvData.forEach(row => {
      const name = row['OwnerName'] || 'Неизвестный';
      const email = row['Username'] || 'Не указан';
  
      content += `<p>Здравствуйте - <b>${name}</b>,</p>`;
      content += `<p>Его email: <b>${email}</b></p>`;
      content += `<p><b>Остальные данные:</b></p><ul>`;
  
      headers.forEach(header => {
        if (header !== 'OwnerName' && header !== 'Username') {
          content += `<li><b>${header}:</b> ${row[header]}</li>`;
        }
      });
      content += `</ul><hr/>`; 
    });
  
    content += `</body></html>`;
  
    const blob = new Blob(["\ufeff" + content], { type: 'application/msword;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'all-users.doc'; 
    link.click();
  }  
  
  downloadSelectedTable() {
    if (this.selectedRows.length === 0) {
      alert('Please select at least one row to download');
      return;
    }
  
    const headers = this.getObjectKeys(this.selectedRows[0]);
    let content = `<html><body>`;
  
    this.selectedRows.forEach(row => {
      const name = row['OwnerName'] || 'Неизвестный';
      const email = row['Username'] || 'Не указан';
  
      content += `<p>Здравствуйте - <b>${name}</b>,</p>`;
      content += `<p>Его email: <b>${email}</b></p>`;
      content += `<p><b>Остальные данные:</b></p><ul>`;
  
      headers.forEach(header => {
        if (header !== 'OwnerName' && header !== 'Username') {
          content += `<li><b>${header}:</b> ${row[header]}</li>`;
        }
      });
      content += `</ul><hr/>`; 
    });
  
    content += `</body></html>`;
  
    const blob = new Blob(["\ufeff" + content], { type: 'application/msword;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'selected-users.doc';
    link.click();
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
