import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

interface CertificateData {
  id: string;
  issuedAt: string;
  validUntil: string;
  issuer: string;
  productType: string;
  quantity: string;
  origin: string;
  destination: string;
  grade: string;
  moisture: string;
  qrData: string;
}

export async function generateProfessionalPDF(data: CertificateData) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // --- Decorative Border ---
  doc.setLineWidth(2);
  doc.setDrawColor(34, 197, 94); // Green-500
  doc.rect(10, 10, width - 20, height - 20);

  doc.setLineWidth(0.5);
  doc.setDrawColor(34, 197, 94);
  doc.rect(12, 12, width - 24, height - 24);

  // --- Header ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(34, 197, 94);
  doc.text('AGRI-PASS', width / 2, 30, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.text('Digital Product Passport', width / 2, 40, { align: 'center' });

  // --- Certificate ID ---
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Certificate ID: ${data.id}`, width / 2, 48, { align: 'center' });

  // --- Content Grid ---

  // Left Side: Product Info
  autoTable(doc, {
    startY: 60,
    margin: { left: 20 },
    tableWidth: (width / 2) - 30,
    head: [['Product Details', '']],
    body: [
      ['Product', data.productType],
      ['Quantity', data.quantity],
      ['Origin', data.origin],
      ['Destination', data.destination],
    ],
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94], textColor: 255 },
    styles: { fontSize: 11, cellPadding: 3 },
  });

  // Right Side: Inspection Info
  autoTable(doc, {
    startY: 60, // Align with previous table
    margin: { left: (width / 2) + 10 },
    tableWidth: (width / 2) - 30,
    head: [['Inspection Results', '']],
    body: [
      ['Quality Grade', data.grade],
      ['Moisture Content', `${data.moisture}%`],
      ['Status', 'CERTIFIED'],
      ['Standard', 'ISO-17065'], // Static for now, could be dynamic
    ],
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94], textColor: 255 },
    styles: { fontSize: 11, cellPadding: 3 },
  });

  // --- QR Code ---
  try {
    // Generate QR Data URL
    const qrDataUrl = await QRCode.toDataURL(data.qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1
    });

    // Add Image to PDF
    const qrSize = 50;
    const qrX = width - 20 - qrSize - 10;
    const qrY = height - 20 - qrSize - 20;

    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Scan to Verify Offline", qrX + (qrSize / 2), qrY + qrSize + 5, { align: 'center' });
  } catch (err) {
    console.error("Failed to generate QR for PDF", err);
  }

  // --- Issuer Stamp & Signature Area ---
  const stampY = height - 70;
  const stampX = 30;

  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(1);
  doc.line(stampX, stampY + 20, stampX + 60, stampY + 20); // Signature line

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text("Authorized Signature", stampX, stampY + 28);

  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.text(`Issuer: ${data.issuer}`, stampX, stampY + 35);
  doc.text(`Date: ${new Date(data.issuedAt).toLocaleDateString()}`, stampX, stampY + 40);
  doc.text(`Valid Until: ${new Date(data.validUntil).toLocaleDateString()}`, stampX, stampY + 45);

  // --- Save ---
  doc.save(`${data.id}_certificate.pdf`);
}
