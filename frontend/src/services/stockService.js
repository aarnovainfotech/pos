import api from './api';

export const stockService = {

  getAll() {
    return api.get('/stock');
  },

  stockIn(data) {
    return api.post('/stock/in', data);
  },

  stockOut(data) {
    return api.post('/stock/out', data);
  },
  getLowStock() {
    return api.get('/stock/low');
  }
};
