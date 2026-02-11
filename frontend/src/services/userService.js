import api from './api';

export const userService = {
  getAll() {
    return api.get('/users'); 
    // returns { success, data }
  },

  createCashier(data) {
    return api.post('/users/cashier', data);
  },

  update(id, data) {
    return api.put(`/users/${id}`, data);
  },

  remove(id) {
    return api.delete(`/users/${id}`);
  }
};
