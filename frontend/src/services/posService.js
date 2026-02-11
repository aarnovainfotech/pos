const API = 'http://127.0.0.1:3001/api';

/* ============================
   FETCH VARIANT BY BARCODE
============================ */
export async function fetchVariantByBarcode(barcode) {
  const res = await fetch(`${API}/variants/barcode/${barcode}`);

  if (!res.ok) {
    throw new Error('Product not found');
  }

  return res.json();
}

/* ============================ 
   CREATE SALE (POS CHECKOUT)
============================ */
export async function createSale(data) {
  const token = localStorage.getItem('TOKEN'); // or auth_token

  const res = await fetch(`${API}/sales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Sale failed');
  }

  return res.json();
}
