import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, Packer } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Converts rich HTML content from the editor into a real Microsoft Word (.docx) document
 */
export async function exportToDocx(htmlContent: string, fileName: string = 'document_gemmawors_rdc.docx') {
  const container = document.createElement('div');
  container.innerHTML = htmlContent;

  const children: any[] = [];

  // Helper to parse child nodes into TextRuns
  const parseTextRuns = (node: Node): TextRun[] => {
    const runs: TextRun[] = [];

    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.textContent) {
          runs.push(new TextRun({ text: child.textContent }));
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        const tag = el.tagName.toLowerCase();
        const textContent = el.innerText || el.textContent || '';

        const isBold = tag === 'b' || tag === 'strong' || el.style.fontWeight === 'bold';
        const isItalic = tag === 'i' || tag === 'em' || el.style.fontStyle === 'italic';
        const isUnderline = tag === 'u' || el.style.textDecoration.includes('underline');
        
        let colorHex: string | undefined = undefined;
        if (el.style.color) {
          const rgbMatch = el.style.color.match(/\d+/g);
          if (rgbMatch && rgbMatch.length >= 3) {
            colorHex = rgbMatch.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
          }
        }

        // Handle nested text
        if (el.childNodes.length > 0) {
          const subRuns = parseTextRuns(el);
          subRuns.forEach(r => {
            runs.push(new TextRun({
              text: r['text' as keyof typeof r] as any || textContent,
              bold: isBold,
              italics: isItalic,
              underline: isUnderline ? {} : undefined,
              color: colorHex
            }));
          });
        } else if (textContent) {
          runs.push(new TextRun({
            text: textContent,
            bold: isBold,
            italics: isItalic,
            underline: isUnderline ? {} : undefined,
            color: colorHex
          }));
        }
      }
    });

    if (runs.length === 0 && node.textContent) {
      runs.push(new TextRun({ text: node.textContent }));
    }

    return runs;
  };

  // Helper for text alignment
  const getAlignment = (el: HTMLElement) => {
    const align = el.style.textAlign || el.getAttribute('align') || '';
    if (align === 'center') return AlignmentType.CENTER;
    if (align === 'right') return AlignmentType.RIGHT;
    if (align === 'justify') return AlignmentType.JUSTIFIED;
    return AlignmentType.LEFT;
  };

  // Iterate top-level elements
  container.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      children.push(new Paragraph({
        children: [new TextRun({ text: node.textContent.trim() })],
      }));
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === 'h1') {
      children.push(new Paragraph({
        text: el.innerText.trim(),
        heading: HeadingLevel.HEADING_1,
        alignment: getAlignment(el),
        spacing: { before: 240, after: 120 }
      }));
    } else if (tag === 'h2') {
      children.push(new Paragraph({
        text: el.innerText.trim(),
        heading: HeadingLevel.HEADING_2,
        alignment: getAlignment(el),
        spacing: { before: 200, after: 100 }
      }));
    } else if (tag === 'h3') {
      children.push(new Paragraph({
        text: el.innerText.trim(),
        heading: HeadingLevel.HEADING_3,
        alignment: getAlignment(el),
        spacing: { before: 160, after: 80 }
      }));
    } else if (tag === 'p' || tag === 'div') {
      const runs = parseTextRuns(el);
      if (runs.length > 0 || el.innerText.trim()) {
        children.push(new Paragraph({
          children: runs.length > 0 ? runs : [new TextRun({ text: el.innerText })],
          alignment: getAlignment(el),
          spacing: { after: 120 }
        }));
      }
    } else if (tag === 'ul' || tag === 'ol') {
      const listItems = el.querySelectorAll('li');
      listItems.forEach((li) => {
        const runs = parseTextRuns(li);
        children.push(new Paragraph({
          children: runs.length > 0 ? runs : [new TextRun({ text: li.innerText })],
          bullet: tag === 'ul' ? { level: 0 } : undefined,
          spacing: { after: 60 }
        }));
      });
    } else if (tag === 'table') {
      const rows: TableRow[] = [];
      const trList = el.querySelectorAll('tr');
      trList.forEach((tr) => {
        const cells: TableCell[] = [];
        const cellList = tr.querySelectorAll('td, th');
        cellList.forEach((cell) => {
          const isHeader = cell.tagName.toLowerCase() === 'th';
          const cellRuns = parseTextRuns(cell as HTMLElement);
          cells.push(new TableCell({
            children: [
              new Paragraph({
                children: cellRuns.length > 0 ? cellRuns : [new TextRun({ text: (cell as HTMLElement).innerText })],
              })
            ],
            shading: isHeader ? { fill: 'F1F5F9' } : undefined,
            width: { size: 100 / Math.max(1, cellList.length), type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            }
          }));
        });
        if (cells.length > 0) {
          rows.push(new TableRow({ children: cells }));
        }
      });
      if (rows.length > 0) {
        children.push(new Table({
          rows,
          width: { size: 100, type: WidthType.PERCENTAGE }
        }));
        children.push(new Paragraph({ text: '', spacing: { after: 120 } }));
      }
    } else if (tag === 'blockquote') {
      const runs = parseTextRuns(el);
      children.push(new Paragraph({
        children: runs,
        alignment: getAlignment(el),
        indent: { left: 720 },
        spacing: { before: 120, after: 120 }
      }));
    } else {
      const runs = parseTextRuns(el);
      if (runs.length > 0) {
        children.push(new Paragraph({
          children: runs,
          alignment: getAlignment(el),
          spacing: { after: 100 }
        }));
      }
    }
  });

  if (children.length === 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: container.innerText || 'Document GemmaWork RDC' })],
    }));
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch = 1440 twips (2.54 cm)
              bottom: 1440,
              left: 1440,
              right: 1440,
            }
          }
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
}
