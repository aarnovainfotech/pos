const API = 'http://127.0.0.1:3001/api';

export async function fetchProducts() {
  const res = await fetch(`${API}/products`);
  return res.json();
}

export async function createProduct(data) {
  const res = await fetch(`${API}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function createVariant(data) {
  const res = await fetch(`${API}/products/variant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
