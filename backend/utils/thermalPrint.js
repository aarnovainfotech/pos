export function printThermalInvoice(sale) {
    const w = window.open('', 'PRINT', 'height=600,width=400');
  
    w.document.write(`
      <html>
      <head>
        <style>
          body { font-family: monospace; font-size: 12px; }
          h2 { text-align: center; }
          hr { border-top: 1px dashed #000; }
        </style>
      </head>
      <body>
        <h2>SMART POS</h2>
        <p>Invoice: ${sale.invoice_no}</p>
        <hr />
        ${sale.items
          .map(
            i => `<div>${i.sku} x ${i.quantity} = ₹${i.total}</div>`
          )
          .join('')}
        <hr />
        <strong>Total: ₹${sale.grand_total}</strong>
        <p>Thank you!</p>
      </body>
      </html>
    `);
  
    w.document.close();
    w.focus();
    w.print();
    w.close();
  }
  