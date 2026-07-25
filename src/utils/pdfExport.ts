import jsPDF from 'jspdf';

/**
 * Converts rich HTML content or DOM element into a clean A4 PDF file
 */
export async function exportToPdf(htmlElement: HTMLElement, fileName: string = 'document_gemmawork_rdc.pdf') {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
  const marginX = 15;
  const marginY = 15;
  const printableWidth = pageWidth - (marginX * 2);

  const clone = htmlElement.cloneNode(true) as HTMLElement;
  clone.style.width = `${printableWidth}mm`;
  clone.style.padding = '0';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.border = 'none';
  clone.style.background = '#ffffff';

  const wrapper = document.createElement('div');
  wrapper.style.position = 'absolute';
  wrapper.style.left = '-9999px';
  wrapper.style.top = '-9999px';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    await pdf.html(clone, {
      callback: (doc) => {
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`GemmaWork RDC — Page ${i} / ${totalPages}`, pageWidth - marginX - 45, pageHeight - 8);
        }
        doc.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
        if (document.body.contains(wrapper)) {
          document.body.removeChild(wrapper);
        }
      },
      x: marginX,
      y: marginY,
      width: printableWidth,
      windowWidth: 800,
      autoPaging: 'text',
    });
  } catch (err) {
    console.warn('Fallback HTML PDF generation error, using canvas fallback:', err);
    const textContent = htmlElement.innerText;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const lines = pdf.splitTextToSize(textContent, printableWidth);
    let currentY = marginY;

    lines.forEach((line: string) => {
      if (currentY + 6 > pageHeight - marginY) {
        pdf.addPage();
        currentY = marginY;
      }
      pdf.text(line, marginX, currentY);
      currentY += 5;
    });

    pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
    if (document.body.contains(wrapper)) {
      document.body.removeChild(wrapper);
    }
  }
}

export async function exportToPDF(title: string, htmlContentOrText: string, category: string = '') {
  const sanitizeFileName = (name: string) => {
    return (name || 'document_gemmawork_rdc')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 40) + '.pdf';
  };

  const tempDiv = document.createElement('div');
  tempDiv.className = 'pdf-render-temp';
  tempDiv.style.fontFamily = 'Helvetica, Arial, sans-serif';
  tempDiv.style.color = '#1e293b';

  const header = `
    <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-bottom: 16px;">
      <h1 style="font-size: 20px; font-weight: bold; color: #0f172a; margin: 0 0 4px 0;">${title}</h1>
      <p style="font-size: 10px; color: #64748b; margin: 0;">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO • ${category || 'GemmaWork RDC'}</p>
    </div>
  `;

  tempDiv.innerHTML = header + (htmlContentOrText.startsWith('<') ? htmlContentOrText : htmlContentOrText.split('\n').map(l => `<p style="margin-bottom: 8px;">${l}</p>`).join(''));

  await exportToPdf(tempDiv, sanitizeFileName(title));
}

