import api from './api';

export const variantService = {
  getAll() {
    return api.get('/variants');
  },

  create(data) {
    return api.post('/variants', data);
  },

  remove(id) {
    return api.delete(`/variants/${id}`);
  },

  mapAttributes(id, attributes) {
    return api.post(`/variants/${id}/attributes`, { attributes });
  },

  update(id, data) {
    return api.put(`/variants/${id}`, data);
  }
  
};
