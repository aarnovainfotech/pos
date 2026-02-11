import api from './api';

export const attributeService = {
  getAll() {
    return api.get('/attributes');
  },

  create(data) {
    return api.post('/attributes', data);
  },

  update(id, data) {
    return api.put(`/attributes/${id}`, data);
  },

  remove(id) {
    return api.delete(`/attributes/${id}`);
  },

  addValue(attributeId, value) {
    return api.post(`/attributes/${attributeId}/values`, { value });
  },

  removeValue(id) {
    return api.delete(`/attribute-values/${id}`);
  },

   // ✅ REQUIRED BY Variants.jsx
   getAllWithValues() {
    return api.get('/attributes/with-values');
  }
};
