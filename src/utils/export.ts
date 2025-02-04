import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Student } from '../types/room';

export const exportFunctions = {
  toPDF: (data: Student[], filename: string) => {
    const doc = new jsPDF();
    
    // Add headers
    doc.setFontSize(12);
    doc.text('Student List', 10, 10);
    
    // Add data
    let yPos = 20;
    data.forEach((student) => {
      doc.text(`${student.name} - ${student.email}`, 10, yPos);
      yPos += 10;
    });
    
    doc.save(`${filename}.pdf`);
  },

  toExcel: (data: Student[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }
}; 