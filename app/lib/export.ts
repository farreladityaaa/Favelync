import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { formatCurrency } from './utils';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToExcel = (data: any[], filename: string) => {
  if (data.length === 0) return;
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = (data: any[], title: string, filename: string) => {
  if (data.length === 0) return;
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 22);

  const headers = Object.keys(data[0]);
  const rows = data.map(obj => Object.values(obj).map(val => {
    if (typeof val === 'number') {
      if (val > 1000) return formatCurrency(val);
      return val.toString();
    }
    return val;
  }));

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 28,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [24, 33, 62] }
  });

  doc.save(`${filename}.pdf`);
};

export const exportToWord = async (data: any[], title: string, filename: string) => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  
  const headerRow = new TableRow({
    children: headers.map(header => new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: header, bold: true })] })],
      shading: { fill: "f0f0f0" }
    }))
  });

  const dataRows = data.map(obj => {
    return new TableRow({
      children: Object.values(obj).map(val => {
        let textVal = '';
        if (typeof val === 'number') {
          textVal = val > 1000 ? formatCurrency(val) : val.toString();
        } else {
          textVal = val as string;
        }
        return new TableCell({
          children: [new Paragraph(textVal)]
        });
      })
    });
  });

  const table = new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
      insideVertical: { style: BorderStyle.SINGLE, size: 1 },
    }
  });

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          children: [new TextRun({ text: title, bold: true, size: 32 })]
        }),
        new Paragraph({
          children: [new TextRun({ text: `Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}` })]
        }),
        new Paragraph(""),
        table
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
};
