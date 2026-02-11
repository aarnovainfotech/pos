import { useEffect, useState } from 'react';
import { getSettings, saveSettings } from '../../services/appSettingsService';

export default function Settings() {
  const [form, setForm] = useState({
    shop_name: '',
    gst_percent: 0,
    currency: '₹',
    invoice_footer: ''
  });

  useEffect(() => {
    getSettings().then(setForm);
  }, []);

  function save() {
    saveSettings(form).then(() => alert('Settings saved'));
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <h2>Shop Settings</h2>

      <input
        placeholder="Shop Name"
        value={form.shop_name}
        onChange={e => setForm({ ...form, shop_name: e.target.value })}
      />

      <input
        type="number"
        placeholder="GST %"
        value={form.gst_percent}
        onChange={e => setForm({ ...form, gst_percent: e.target.value })}
      />

      <input
        placeholder="Currency Symbol"
        value={form.currency}
        onChange={e => setForm({ ...form, currency: e.target.value })}
      />

      <textarea
        placeholder="Invoice Footer"
        value={form.invoice_footer}
        onChange={e => setForm({ ...form, invoice_footer: e.target.value })}
      />

      <button onClick={save}>Save</button>
    </div>
  );
}
