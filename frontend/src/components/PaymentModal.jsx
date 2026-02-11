export default function PaymentModal({ total, onPay, onClose }) {
    return (
      <div style={overlay}>
        <div style={box}>
          <h3>Payment</h3>
          <p>Total: ₹{total}</p>
  
          <button onClick={() => onPay('CASH')}>💵 Cash</button>
          <button onClick={() => onPay('UPI')}>📱 UPI</button>
  
          <br /><br />
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    );
  }
  
  const overlay = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };
  
  const box = {
    background: '#fff',
    padding: 20,
    width: 300,
    borderRadius: 6
  };
  