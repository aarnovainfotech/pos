import { printThermal } from '../utils/thermalPrint';

export default function InvoicePrint({ invoice }) {
  if (!invoice) return null;

  return (
    <div style={{ marginTop: 20, color: 'black' }}>
      <h3>🧾 Invoice Generated</h3>

      <div style={{ fontFamily: 'monospace', fontSize: 14 }}>
        Invoice: {invoice.invoice_no}<br />
        Total: ₹{invoice.grand_total?.toFixed(2)}<br />
        Payment: {invoice.payment_method}
      </div>

      <br />

      <button onClick={() => printThermal(invoice)}>
        🖨 Print
      </button>

      <button style={{ marginLeft: 10 }} onClick={() => printThermal(invoice)}>
        🔁 Reprint
      </button>
    </div>
  );
}
