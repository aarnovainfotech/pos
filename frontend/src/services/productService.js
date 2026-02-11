import api from './api';

export const productService = {
  getAll() {
    return api.get('/products');
  },

  create(data) {
    return api.post('/products', data);
  },

  update(id, data) {
    return api.put(`/products/${id}`, data);
  },

  remove(id) {
    return api.delete(`/products/${id}`);
  }
};
