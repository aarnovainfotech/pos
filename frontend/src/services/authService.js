export async function loginRequest(data) {
  const res = await fetch('http://127.0.0.1:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || 'Login failed');
  }

  return {
    ...json.user,
    token: json.token
  };
}
