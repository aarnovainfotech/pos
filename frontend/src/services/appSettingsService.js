const API = 'http://127.0.0.1:3001/api';

export async function getSettings() {
  const res = await fetch(`${API}/appsettings`);
  return res.json();
}

export async function saveSettings(data) {
  const res = await fetch(`${API}/appsettings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  return res.json();
}
