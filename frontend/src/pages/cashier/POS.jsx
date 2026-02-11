import { useEffect, useRef, useState } from "react";
import { fetchVariantByBarcode, createSale } from "../../services/posService";
import PaymentModal from "../../components/PaymentModal";
import InvoicePrint from "../../components/InvoicePrint";
import DiscountModal from "../../components/DiscountModal";
import { customerService } from "../../services/customerService";

export default function POS() {
  const [cart, setCart] = useState([]);
  const [holdCart, setHoldCart] = useState(null);

  const [showPay, setShowPay] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  const [manualCode, setManualCode] = useState("");
  const [isManualTyping, setIsManualTyping] = useState(false);

  const [discountType, setDiscountType] = useState("AMOUNT");
  const [discountValue, setDiscountValue] = useState(0);

  const [toast, setToast] = useState(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  
  const beepRef = useRef(null);
  const scanInputRef = useRef(null);
  const bufferRef = useRef("");
  const timerRef = useRef(null);

  /* =========================
     TOAST
  ========================= */
  function showToast(msg, type = "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  /* =========================
     SCANNER FOCUS
  ========================= */
  useEffect(() => {
    if (!showPay && !showDiscount && !isManualTyping) {
      scanInputRef.current?.focus();
    }
  }, [showPay, showDiscount, isManualTyping]);

  function focusScanner() {
    setTimeout(() => {
      scanInputRef.current?.focus();
    }, 100);
  }
  
  /* =========================
     SCANNER HANDLER
  ========================= */
  function onScanKeyDown(e) {
    if (showPay || showDiscount || isManualTyping) return;

    if (e.key === "Enter") {
      e.preventDefault();
      const code = bufferRef.current;
      bufferRef.current = "";
      if (code.length >= 3) processBarcode(code);
      return;
    }

    if (e.key.length === 1) {
      bufferRef.current += e.key;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        bufferRef.current = "";
      }, 80);
    }
  }

  /* =========================
     BARCODE PROCESS
  ========================= */
  async function processBarcode(raw) {
    let barcode = raw.trim();
    let qty = 1;

    if (barcode.includes("*")) {
      const parts = barcode.split("*");
      barcode = parts[0];
      qty = parseInt(parts[1]) || 1;
    }

    try {
      const variant = await fetchVariantByBarcode(barcode);

      if (!variant?.id) {
        showToast("❌ Product not found");
        return;
      }

      if (variant.stock_quantity < qty) {
        showToast("❌ Insufficient stock");
        return;
      }

      beepRef.current?.play().catch(() => {});
      addToCart(variant, qty);
    } catch {
      showToast("❌ Invalid barcode");
    }
  }

  /* =========================
     CART
  ========================= */
  function addToCart(v, qty) {
    const price = Number(v.selling_price);
    const gst = Number(v.gst_percent || 0);

    setCart((prev) => {
      const found = prev.find((i) => i.variant_id === v.id);
      if (found) {
        return prev.map((i) =>
          i.variant_id === v.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }

      return [
        ...prev,
        {
          variant_id: v.id,
          name: v.product_name,
          price,
          gst_percent: gst,
          quantity: qty,
        },
      ];
    });
  }

  /* =========================
     HOLD / RESUME
  ========================= */
  function holdBill() {
    if (!cart.length) return;
    setHoldCart({ cart, discountType, discountValue });
    setCart([]);
    setDiscountValue(0);
    showToast("🧾 Bill held", "success");
  }

  function resumeBill() {
    if (!holdCart) return;
    setCart(holdCart.cart);
    setDiscountType(holdCart.discountType);
    setDiscountValue(holdCart.discountValue);
    setHoldCart(null);
    showToast("▶ Bill resumed", "success");
  }
  /* =========================
     CUSTOMER LOOKUP
  ========================= */
  async function handleCustomerPhone(phone) {
    setCustomerPhone(phone);
  
    // reset if user edits number again
    if (phone.length < 10) {
      setCustomerId(null);
      setCustomerName('');
      return;
    }
  
    // fetch only when exactly 10 digits
    if (phone.length !== 10) return;
  
    setCustomerLoading(true);
  
    try {
      const res = await customerService.findByPhone(phone);
  
      // api wrapper returns data directly
      if (res?.id) {
        setCustomerId(res.id);
        setCustomerName(res.name || '');
        showToast('👤 Customer found', 'success');
      } else {
        setCustomerId(null);
        setCustomerName('');
        showToast('➕ New customer', 'info');
      }
    } catch {
      setCustomerId(null);
      setCustomerName('');
      showToast('➕ New customer', 'info');
    } finally {
      setCustomerLoading(false);
      focusScanner(); // ✅ AUTO-FOCUS BARCODE
    }
  }
  
  /* =========================
     TOTALS
  ========================= */
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const discountAmount =
    discountType === "PERCENT"
      ? (subtotal * discountValue) / 100
      : discountValue;

  const safeDiscount = Math.min(discountAmount, subtotal);

  const gstTotal = cart.reduce((s, i) => {
    const itemSub = i.price * i.quantity;
    const itemDisc = subtotal ? (itemSub / subtotal) * safeDiscount : 0;
    return s + ((itemSub - itemDisc) * i.gst_percent) / 100;
  }, 0);

  const grandTotal = subtotal - safeDiscount + gstTotal;

  /* =========================
     COMPLETE SALE
  ========================= */
  async function completeSale(method) {
    setLoading(true);
    let finalCustomerId = customerId;

    if (!customerId && customerPhone && customerName) {
      try {
        const res = await customerService.create({
          phone: customerPhone,
          name: customerName,
        });
        console.log('res-->'+res);
        finalCustomerId = res.id;
        console.log('finalCustomerId-->'+finalCustomerId);
        console.log('finalCustomerId-->'+res.id);
      } catch {
        showToast("❌ Customer create failed");
        setLoading(false);
        return;
      }
    }
    const items = cart.map((i) => {
      const itemSub = i.price * i.quantity;
      const itemDisc = subtotal
        ? (itemSub / subtotal) * safeDiscount
        : 0;
      const taxable = itemSub - itemDisc;
      const gst = (taxable * i.gst_percent) / 100;

      return {
        variant_id: i.variant_id,
        quantity: i.quantity,
        name: i.name, 
        price: i.price,
        gst_percent: i.gst_percent,
        discount: itemDisc,
        gst_amount: gst,
        total: taxable + gst,
      };
    });

    try {
      const res = await createSale({
        customer_id: finalCustomerId,
        subtotal,
        gst_total: gstTotal,
        discount_total: safeDiscount,
        grand_total: grandTotal,
        payment_method: method,
        cashier_id: 7,
        items,
        payments: [{ method, amount: grandTotal }],
      });

      setInvoice({
        invoice_no: res.invoice_no,
        customer_name :customerName,
        customer_phone :customerPhone,
        items,
        subtotal,
        gst_total: gstTotal,
        discount_total: safeDiscount,
        grand_total: grandTotal,
        payment_method: method
      });
      
      setCart([]);
      setDiscountValue(0);
      setShowPay(false);
      setCustomerPhone("");
      setCustomerName("");
    } catch {
      showToast("❌ Sale failed");
    } finally {
      setLoading(false);
    }
  }

  
  /* =========================
     UI
  ========================= */
  return (
    <div style={styles.page}>
      <audio ref={beepRef} src="/beep.mp3" />

      <input
        ref={scanInputRef}
        onKeyDown={onScanKeyDown}
        style={{ position: "absolute", opacity: 0 }}
      />

      {/* {toast && <div style={styles.toast}>{toast.msg}</div>} */}

      <div style={styles.card}>
        <h2 style={styles.header}>🧾 SmartPOS Billing</h2>
        {toast && <div style={styles.toast}>{toast.msg}</div>}
        {/* CUSTOMER */}
        <input
              placeholder="Customer Phone"
              value={customerPhone}
              onChange={(e) => handleCustomerPhone(e.target.value)}
              maxLength={10}
              style={styles.barcodeInput}
            />


                <input
                  placeholder="Customer Name"
                  value={customerName}
                  disabled={!!customerId}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{
                    ...styles.barcodeInput,
                    marginTop: 6,
                    background: customerId ? "#e9ecef" : "#fff",
                  }}
                />
        {/* Barcode Input */}
        <div style={styles.barcodeSection}>
          <input
            value={manualCode}
            onFocus={() => setIsManualTyping(true)}
            onBlur={() => setIsManualTyping(false)}
            onChange={(e) => setManualCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && manualCode) {
                processBarcode(manualCode);
                setManualCode("");
              }
            }}
            placeholder="Scan / Enter Barcode"
            style={styles.barcodeInput}
          />
          <button
            style={styles.addBtn}
            onClick={() => {
              if (!manualCode) return;
              processBarcode(manualCode);
              setManualCode("");
            }}
          >
            ADD
          </button>
        </div>

        {/* Items List */}
        <div style={styles.cartHeader}>
          <span style={styles.colName}>Item</span>
          <span style={styles.colQty}>Qty</span>
          <span style={styles.colPrice}>Price</span>
          <span style={styles.colTotal}>Total</span>
        </div>

        {cart.map((i) => (
          <div key={i.variant_id} style={styles.cartItem}>
            <span style={styles.colName}>{i.name}</span>
            <span style={styles.colQty}>{i.quantity}</span>
            <span style={styles.colPrice}>
              ₹{i.price.toFixed(2)}
            </span>
            <span style={styles.colTotal}>
              ₹{(i.price * i.quantity).toFixed(2)}
            </span>
          </div>
        ))}

        {/* Totals */}
        <div style={styles.totalsSection}>
          <div>Subtotal <span>₹{subtotal.toFixed(2)}</span></div>
          <div>Discount <span>-₹{safeDiscount.toFixed(2)}</span></div>
          <div>GST <span>₹{gstTotal.toFixed(2)}</span></div>
          <div style={styles.grand}>
            Grand Total <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.actionBtn} onClick={() => setShowDiscount(true)}>
            💸 Discount
          </button>

          <button style={styles.actionBtn} onClick={holdBill}>
            ⏸ Hold
          </button>

          {holdCart && (
            <button style={styles.actionBtn} onClick={resumeBill}>
              ▶ Resume
            </button>
          )}
        </div>

        <button
          style={styles.payBtn}
          disabled={!cart.length || loading}
          onClick={() => setShowPay(true)}
        >
          💳 PAY ₹{grandTotal.toFixed(2)}
        </button>
      </div>

      {showPay && (
        <PaymentModal
          total={grandTotal}
          onPay={completeSale}
          onClose={() => setShowPay(false)}
        />
      )}

      {showDiscount && (
        <DiscountModal
          discountType={discountType}
          discountValue={discountValue}
          onApply={(t, v) => {
            setDiscountType(t);
            setDiscountValue(v);
            setShowDiscount(false);
          }}
          onClose={() => setShowDiscount(false)}
        />
      )}

      {invoice && <InvoicePrint invoice={invoice} />}
    </div>
  );
}

/* =========================
   STYLES (CLEAN MODERN POS)
========================= */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#eff2f7",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 30,
    fontFamily: "Segoe UI, Roboto, Arial"
  },
  card: {
    width: 500,
    background: "#aaaa",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
  },
  header: {
    fontSize: 24,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 15
  },
  toast: {
    position: "fixed",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#262626",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 6
  },
  barcodeSection: {
    display: "flex",
    gap: 10,
    marginBottom: 15
  },
  barcodeInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #bbb"
  },
  addBtn: {
    padding: "0 22px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
  },
  cartHeader: {
    display: "grid",
    gridTemplateColumns: "3fr 1fr 1fr 1fr",
    fontWeight: 600,
    borderBottom: "1px solid #ccc", 
    paddingBottom: 8,
    marginTop: 10
  },
  cartItem: {
    display: "grid",
    gridTemplateColumns: "3fr 1fr 1fr 1fr",
    padding: "8px 0",
    borderBottom: "1px solid #eee"
  },
  colName: { textAlign: "left" },
  colQty: { textAlign: "center" },
  colPrice: { textAlign: "right" },
  colTotal: { textAlign: "right" },
  totalsSection: {
    marginTop: 15,
    fontSize: 16,
    borderTop: "1px solid #ccc",
    paddingTop: 10
  },
  grand: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5
  },
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 15,
    justifyContent: "center"
  },
  actionBtn: {
    padding: "8px 16px",
    background: "#f1f1f1",
    border: "1px solid #999",
    borderRadius: 8,
    cursor: "pointer"
  },
  payBtn: {
    background: "#28a745",
    color: "#fff",
    padding: "14px",
    fontSize: 18,
    border: "none",
    borderRadius: 10,
    width: "100%",
    marginTop: 15,
    cursor: "pointer"
  }
};
