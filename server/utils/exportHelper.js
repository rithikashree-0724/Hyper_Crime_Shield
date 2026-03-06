const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');

exports.generateReportsPDF = (reports) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));

            // PDF Content
            doc.fontSize(20).text('Hyper Crime Shield - Statistical Report', { align: 'center' });
            doc.moveDown();
            doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
            doc.moveDown();

            reports.forEach((r, i) => {
                doc.fontSize(12).text(`${i + 1}. Case ID: ${r.complaintId || r.id}`, { underline: true });
                doc.fontSize(10).text(`Title: ${r.title}`);
                doc.text(`Category: ${r.category}`);
                doc.text(`Severity: ${r.severity}`);
                doc.text(`Status: ${r.status}`);
                doc.text(`Reporter: ${r.isAnonymous ? 'Anonymous' : (r.user?.name || 'Unknown')}`);
                doc.text(`Date: ${new Date(r.createdAt).toLocaleDateString()}`);
                doc.moveDown();
            });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};

exports.generateReportsExcel = (reports) => {
    const data = reports.map(r => ({
        'Complaint ID': r.complaintId || r.id,
        'Title': r.title,
        'Category': r.category,
        'Severity': r.severity,
        'Status': r.status,
        'Reporter': r.isAnonymous ? 'Anonymous' : (r.user?.name || 'N/A'),
        'Date': new Date(r.createdAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Crime Reports');

    // Write to buffer
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
};
