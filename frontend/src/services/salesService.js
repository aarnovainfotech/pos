import api from './api';

export const salesService = {
  createSale(data) {
    return api.post('/sales', data);
  },

  getSale(id) {
    return api.get(`/sales/${id}`);
  }
};
