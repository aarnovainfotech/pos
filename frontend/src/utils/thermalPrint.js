export function printThermal(invoice) {
  if (!invoice) return;

  const items = invoice.items || [];

  let text = '';

  const line = '--------------------------------\n';

  text += '        SMART POS\n';
  if (invoice.customer_name) {
    text += `Customer: ${invoice.customer_name}\n`;
    text += `Phone: ${invoice.customer_phone}\n`;
    text += '--------------------------\n';
  }
  
  text += line;
  text += `Invoice : ${invoice.invoice_no}\n`;
  text += `Date    : ${new Date().toLocaleString()}\n`;
  text += line;

  text += 'ITEM          QTY   RATE   AMT\n';
  text += line;

  items.forEach(i => {
    const name = (i.name || 'ITEM').substring(0, 12).padEnd(12, ' ');
    const qty = String(i.quantity).padStart(3, ' ');
    const rate = i.price.toFixed(2).padStart(7, ' ');
    const amt = i.total.toFixed(2).padStart(7, ' ');

    text += `${name} ${qty} ${rate} ${amt}\n`;
  });

  text += line;

  const subtotal = invoice.subtotal || 0;
  const discount = invoice.discount_total || 0;
  const gst = invoice.gst_total || 0;
  const total = invoice.grand_total || 0;

  text += `Subtotal        ${subtotal.toFixed(2).padStart(10, ' ')}\n`;
  if (discount > 0)
    text += `Discount        ${discount.toFixed(2).padStart(10, ' ')}\n`;
  text += `GST             ${gst.toFixed(2).padStart(10, ' ')}\n`;

  text += line;
  text += `TOTAL           ${total.toFixed(2).padStart(10, ' ')}\n`;
  text += line;

  text += `Paid By : ${invoice.payment_method || 'CASH'}\n`;
  text += line;
  text += 'Thank You 🙏\n\n\n';

  const win = window.open('', '_blank', 'width=320,height=600');

  win.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          body {
            font-family: monospace;
            font-size: 12px;
            white-space: pre;
            margin: 0;
            padding: 8px;
          }
        </style>
      </head>
      <body>${text}</body>
    </html>
  `);

  win.document.close();
  win.focus();

  setTimeout(() => {
    win.print();
    win.close();
  }, 300);
}
