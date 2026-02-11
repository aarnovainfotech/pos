import { useEffect, useState } from 'react';
import { attributeService } from '../../services/attributeService';
import './attributes.css';

export default function Attributes() {
  const [attributes, setAttributes] = useState([]);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [activeAttr, setActiveAttr] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await attributeService.getAll();
    setAttributes(res.data);
  }

  async function addAttribute(e) {
    e.preventDefault();
    if (!name) return;
    await attributeService.create({ name });
    setName('');
    load();
  }

  async function addValue(attrId) {
    if (!value) return;
    await attributeService.addValue(attrId, value);
    setValue('');
    setActiveAttr(null);
    load();
  }

  async function removeAttr(id) {
    if (!window.confirm('Delete this attribute?')) return;
    await attributeService.remove(id);
    load();
  }

  async function removeValue(id) {
    await attributeService.removeValue(id);
    load();
  }

  return (
    <div className="attributes-page">
      <div className="attributes-container">
        <h1>🎨 Attributes</h1>

        {/* Add Attribute */}
        <form className="add-attribute" onSubmit={addAttribute}>
          <input
            placeholder="Attribute name (Color, Size, Brand...)"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <button className="btn primary">Add</button>
        </form>

        {/* Attribute Cards */}
        <div className="attribute-list">
          {attributes.map(attr => (
            <div className="attribute-card" key={attr.id}>
              <div className="attribute-header">
                <h3>{attr.name}</h3>
                <button
                  className="icon danger"
                  onClick={() => removeAttr(attr.id)}
                  title="Delete attribute"
                >
                  🗑️
                </button>
              </div>

              {/* Values */}
              <div className="values">
                {attr.values.map(v => (
                  <span className="chip" key={v.id}>
                    {v.value}
                    <button
                      onClick={() => removeValue(v.id)}
                      title="Remove value"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Value */}
              <div className="add-value">
                <input
                  placeholder="Add value"
                  value={activeAttr === attr.id ? value : ''}
                  onFocus={() => setActiveAttr(attr.id)}
                  onChange={e => setValue(e.target.value)}
                />
                <button
                  className="icon add"
                  onClick={() => addValue(attr.id)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
