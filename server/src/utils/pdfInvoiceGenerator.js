const PDFDocument = require('pdfkit');

/**
 * Generates a PDF invoice Buffer for a completed order.
 * @param {Object} order - Mongoose Order Document
 * @param {Object} user - User object { name, email }
 * @returns {Promise<Buffer>}
 */
exports.generateInvoicePDF = (order, user = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Colors
      const primaryColor = '#8B5CF6';
      const darkColor = '#0F172A';
      const textGray = '#475569';
      const lightBg = '#F8FAFC';

      // ── 1. HEADER ─────────────────────────────────────────────────────────────
      doc
        .rect(0, 0, 595.28, 90)
        .fill(darkColor);

      doc
        .fillColor('#FFFFFF')
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('NeuroUX', 40, 28, { continued: true })
        .fillColor(primaryColor)
        .text(' Marketplace');

      doc
        .fillColor('#94A3B8')
        .fontSize(10)
        .font('Helvetica')
        .text('AI-Driven Component Library & Design Systems', 40, 56);

      doc
        .fillColor('#FFFFFF')
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('INVOICE', 420, 32, { align: 'right' });

      // ── 2. INVOICE META & CUSTOMER DETAILS ─────────────────────────────────────
      doc.y = 110;

      // Customer Info Column
      doc
        .fillColor(darkColor)
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Billed To:', 40, 110);

      doc
        .fillColor(textGray)
        .fontSize(10)
        .font('Helvetica')
        .text(user.name || 'Valued Customer', 40, 126)
        .text(user.email || 'customer@neuroux.com', 40, 140);

      // Order Info Column
      const invoiceNum = `INV-${order._id.toString().slice(-8).toUpperCase()}`;
      const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });

      doc
        .fillColor(darkColor)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Invoice Number:', 320, 110, { continued: true })
        .font('Helvetica')
        .fillColor(textGray)
        .text(` ${invoiceNum}`);

      doc
        .fillColor(darkColor)
        .font('Helvetica-Bold')
        .text('Date:', 320, 125, { continued: true })
        .font('Helvetica')
        .fillColor(textGray)
        .text(` ${orderDate}`);

      doc
        .fillColor(darkColor)
        .font('Helvetica-Bold')
        .text('Payment Status:', 320, 140, { continued: true })
        .font('Helvetica-Bold')
        .fillColor('#10B981')
        .text(' PAID (Razorpay)');

      if (order.paymentId) {
        doc
          .fillColor(darkColor)
          .font('Helvetica-Bold')
          .text('Transaction ID:', 320, 155, { continued: true })
          .font('Helvetica')
          .fillColor(textGray)
          .text(` ${order.paymentId}`);
      }

      // ── 3. ITEMS TABLE ────────────────────────────────────────────────────────
      const tableTop = 195;

      // Table Header Row
      doc
        .rect(40, tableTop, 515, 25)
        .fill(lightBg);

      doc
        .fillColor(darkColor)
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('ITEM DESCRIPTION', 50, tableTop + 8)
        .text('QTY', 360, tableTop + 8, { width: 40, align: 'center' })
        .text('PRICE', 410, tableTop + 8, { width: 60, align: 'right' })
        .text('AMOUNT', 480, tableTop + 8, { width: 65, align: 'right' });

      doc
        .moveTo(40, tableTop + 25)
        .lineTo(555, tableTop + 25)
        .strokeColor('#E2E8F0')
        .stroke();

      let currentY = tableTop + 33;
      const items = order.items || [];

      items.forEach((item, index) => {
        const itemTotal = (item.price || 0) * (item.quantity || 1);

        doc
          .fillColor(darkColor)
          .fontSize(9)
          .font('Helvetica')
          .text(item.name || `Component Asset #${index + 1}`, 50, currentY, { width: 290, truncate: true })
          .text(String(item.quantity || 1), 360, currentY, { width: 40, align: 'center' })
          .text(`INR ${item.price || 0}`, 410, currentY, { width: 60, align: 'right' })
          .font('Helvetica-Bold')
          .text(`INR ${itemTotal}`, 480, currentY, { width: 65, align: 'right' });

        currentY += 22;

        doc
          .moveTo(40, currentY - 5)
          .lineTo(555, currentY - 5)
          .strokeColor('#F1F5F9')
          .stroke();
      });

      // ── 4. TOTALS SECTION ─────────────────────────────────────────────────────
      const summaryTop = currentY + 15;

      doc
        .rect(340, summaryTop, 215, 60)
        .fill(lightBg);

      const totalAmount = order.totalAmount || 0;

      doc
        .fillColor(darkColor)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('TOTAL AMOUNT:', 355, summaryTop + 22)
        .fontSize(14)
        .fillColor(primaryColor)
        .text(`INR ${totalAmount}`, 450, summaryTop + 20, { align: 'right' });

      // ── 5. FOOTER ─────────────────────────────────────────────────────────────
      const footerTop = 760;

      doc
        .moveTo(40, footerTop)
        .lineTo(555, footerTop)
        .strokeColor('#E2E8F0')
        .stroke();

      doc
        .fillColor(textGray)
        .fontSize(9)
        .font('Helvetica')
        .text('Thank you for choosing NeuroUX Marketplace!', 40, footerTop + 10, { align: 'center' })
        .fontSize(8)
        .fillColor('#94A3B8')
        .text('For support or queries, contact support@neuroux.com', 40, footerTop + 24, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
