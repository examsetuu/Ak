export interface PdfPageImage {
  bytes: Uint8Array;
  w: number;
  h: number;
}

export function buildMultiPagePDF(pages: PdfPageImage[]): Blob {
  const chunks: Uint8Array[] = [];
  let offset = 0;
  const xref: number[] = [0];
  const NL = String.fromCharCode(10);

  function pushStr(s: string) {
    const arr = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) {
      arr[i] = s.charCodeAt(i) & 0xff;
    }
    chunks.push(arr);
    offset += arr.length;
  }

  function pushBytes(b: Uint8Array) {
    chunks.push(b);
    offset += b.length;
  }

  function startObj(id: number) {
    xref[id] = offset;
    pushStr(id + ' 0 obj' + NL);
  }

  pushStr('%PDF-1.4' + NL);
  startObj(1);
  pushStr('<< /Type /Catalog /Pages 2 0 R >>' + NL + 'endobj' + NL);

  const pageIds: number[] = [];
  let nextId = 3;
  pages.forEach(() => {
    pageIds.push(nextId);
    nextId += 3;
  });

  startObj(2);
  pushStr(
    '<< /Type /Pages /Kids [' +
      pageIds.map((id) => id + ' 0 R').join(' ') +
      '] /Count ' +
      pages.length +
      ' >>' +
      NL +
      'endobj' +
      NL
  );

  pages.forEach((p, idx) => {
    const pId = pageIds[idx];
    const cId = pId + 1;
    const iId = pId + 2;

    let pw = 595;
    let ph = Math.round(595 * (p.h / p.w));
    if (ph > 842) {
      ph = 842;
      pw = Math.round(842 * (p.w / p.h));
    }

    startObj(pId);
    pushStr(
      '<< /Type /Page /Parent 2 0 R /Resources << /XObject << /Im0 ' +
        iId +
        ' 0 R >> >> /MediaBox [0 0 ' +
        pw +
        ' ' +
        ph +
        '] /Contents ' +
        cId +
        ' 0 R >>' +
        NL +
        'endobj' +
        NL
    );

    const stream = 'q ' + pw + ' 0 0 ' + ph + ' 0 0 cm /Im0 Do Q' + NL;
    startObj(cId);
    pushStr('<< /Length ' + stream.length + ' >>' + NL + 'stream' + NL + stream + 'endstream' + NL + 'endobj' + NL);

    startObj(iId);
    pushStr(
      '<< /Type /XObject /Subtype /Image /Width ' +
        p.w +
        ' /Height ' +
        p.h +
        ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' +
        p.bytes.length +
        ' >>' +
        NL +
        'stream' +
        NL
    );
    pushBytes(p.bytes);
    pushStr(NL + 'endstream' + NL + 'endobj' + NL);
  });

  const xrefPos = offset;
  pushStr('xref' + NL + '0 ' + nextId + NL + '0000000000 65535 f ' + NL);
  for (let id = 1; id < nextId; id++) {
    let pos = String(xref[id]);
    while (pos.length < 10) pos = '0' + pos;
    pushStr(pos + ' 00000 n ' + NL);
  }
  pushStr('trailer' + NL + '<< /Size ' + nextId + ' /Root 1 0 R >>' + NL + 'startxref' + NL + xrefPos + NL + '%%EOF');

  return new Blob(chunks as any, { type: 'application/pdf' });
}
