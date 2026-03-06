const PDFDocument = require('pdfkit');
const xlsx = require('xlsx');

exports.generateUserPDF = (user) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            resolve(Buffer.concat(buffers));
        });

        // Title
        doc.fontSize(25).text('User Data Export', { align: 'center' });
        doc.moveDown();

        // User Info
        doc.fontSize(16).text('Profile Information', { underline: true });
        doc.fontSize(12).text(`Name: ${user.name}`);
        doc.text(`Email: ${user.email}`);
        doc.text(`Phone: ${user.phone || 'N/A'}`);
        doc.text(`Role: ${user.role}`);
        doc.text(`Account Created: ${new Date(user.createdAt).toLocaleString()}`);
        doc.moveDown();

        // Reports
        if (user.reports && user.reports.length > 0) {
            doc.fontSize(16).text('Submitted Reports', { underline: true });
            user.reports.forEach((report, index) => {
                doc.fontSize(12).text(`${index + 1}. ${report.title} (${report.complaintId || 'N/A'})`);
                doc.fontSize(10).text(`Status: ${report.status} | Category: ${report.category}`);
                doc.text(`Description: ${report.description}`);
                doc.text(`Filed On: ${new Date(report.createdAt).toLocaleString()}`);
                doc.moveDown(0.5);
            });
            doc.moveDown();
        }

        // Audit Logs
        if (user.auditLogs && user.auditLogs.length > 0) {
            doc.fontSize(16).text('Activity Audit Logs', { underline: true });
            user.auditLogs.forEach((log) => {
                doc.fontSize(10).text(`[${new Date(log.createdAt).toLocaleString()}] ${log.action} - IP: ${log.ipAddress || 'N/A'}`);
            });
        }

        doc.end();
    });
};

exports.generateUserExcel = (user) => {
    const wb = xlsx.utils.book_new();

    // Profile Sheet
    const profileData = [
        ['Account Profile Summary', ''],
        ['', ''],
        ['Field', 'Value'],
        ['Name', user.name],
        ['Email', user.email],
        ['Phone', user.phone || 'N/A'],
        ['Role', user.role],
        ['Created At', new Date(user.createdAt).toLocaleString()],
        ['Total Reports Filed', user.reports?.length || 0]
    ];
    const profileWs = xlsx.utils.aoa_to_sheet(profileData);
    xlsx.utils.book_append_sheet(wb, profileWs, 'Profile');

    // Reports Sheet
    if (user.reports && user.reports.length > 0) {
        const reportsData = user.reports.map(r => ({
            'Complaint ID': r.complaintId || r.id,
            'Title': r.title,
            'Category': r.category,
            'Status': r.status,
            'Created At': new Date(r.createdAt).toLocaleString()
        }));
        const reportsWs = xlsx.utils.json_to_sheet(reportsData);
        xlsx.utils.book_append_sheet(wb, reportsWs, 'My Reports');
    }

    // Audit Logs Sheet
    if (user.auditLogs && user.auditLogs.length > 0) {
        const logsData = user.auditLogs.map(l => ({
            'Timestamp': new Date(l.createdAt).toLocaleString(),
            'Action': l.action,
            'IP Address': l.ipAddress || 'N/A',
            'User Agent': l.userAgent || 'N/A'
        }));
        const logsWs = xlsx.utils.json_to_sheet(logsData);
        xlsx.utils.book_append_sheet(wb, logsWs, 'Activity Logs');
    }

    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
};

/**
 * Generates a global PDF report for all cases (Admin)
 */
exports.generateGlobalPDF = (reports, invMap) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 30, layout: 'landscape' });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Header
        doc.fillColor('#137fec').fontSize(24).text('HyperShield Global Crime Report', { align: 'center' });
        doc.fontSize(10).fillColor('#666').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);

        // Table Header
        const startX = 30;
        const colWidths = [100, 150, 100, 80, 120, 140];
        const headers = ['ID', 'Title', 'Category', 'Status', 'Reporter', 'Assigned To'];

        let currentY = doc.y;
        doc.rect(startX, currentY, 790, 20).fill('#f4f7fa');
        doc.fillColor('#101922').fontSize(10).font('Helvetica-Bold');

        let x = startX + 5;
        headers.forEach((h, i) => {
            doc.text(h, x, currentY + 5);
            x += colWidths[i];
        });

        currentY += 25;
        doc.font('Helvetica').fontSize(9);

        // Rows
        reports.forEach((r, idx) => {
            if (currentY > 530) {
                doc.addPage({ layout: 'landscape' });
                currentY = 30;
                // Re-draw header on new page if needed (simplified for now)
            }

            const citizenName = r.user?.name || 'Anonymous';
            const assignedIds = r.investigation?.investigatorIds || [];
            const assignedNames = assignedIds.map(id => invMap[id] || 'General').join(', ') || 'Unassigned';

            const rowData = [
                r.complaintId || String(r.id),
                r.title,
                r.category,
                r.status.toUpperCase(),
                citizenName,
                assignedNames
            ];

            x = startX + 5;
            rowData.forEach((text, i) => {
                doc.text(text, x, currentY, { width: colWidths[i] - 10, truncate: true });
                x += colWidths[i];
            });

            currentY += 20;
            doc.moveTo(startX, currentY - 2).lineTo(startX + 790, currentY - 2).strokeColor('#eee').stroke();
        });

        doc.end();
    });
};

/**
 * Generates a global Excel report for all cases (Admin)
 */
exports.generateGlobalExcel = (reports, invMap) => {
    const wb = xlsx.utils.book_new();

    const data = reports.map(r => {
        const assignedIds = r.investigation?.investigatorIds || [];
        const assignedNames = assignedIds.map(id => invMap[id] || 'General').join(', ') || 'Unassigned';

        return {
            'Complaint ID': r.complaintId || r.id,
            'Date Filed': new Date(r.createdAt).toLocaleDateString(),
            'Title': r.title,
            'Category': r.category,
            'Current Status': r.status.toUpperCase(),
            'Citizen Name': r.user?.name || 'Anonymous',
            'Citizen Email': r.user?.email || 'N/A',
            'Description': r.description,
            'Assigned Investigators': assignedNames,
            'Last Updated': new Date(r.updatedAt).toLocaleString()
        };
    });

    const ws = xlsx.utils.json_to_sheet(data);

    // Set column widths
    const wscols = [
        { wch: 15 }, { wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 12 },
        { wch: 20 }, { wch: 25 }, { wch: 40 }, { wch: 30 }, { wch: 20 }
    ];
    ws['!cols'] = wscols;

    xlsx.utils.book_append_sheet(wb, ws, 'Global Reports');

    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
};
