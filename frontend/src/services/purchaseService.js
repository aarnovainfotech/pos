const API = 'http://127.0.0.1:3001/api';

export async function fetchVariants() {
  const res = await fetch(`${API}/products/variants`);
  return res.json();
}

export async function stockIn(data) {
  const res = await fetch(`${API}/stock/in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  return res.json();
}
