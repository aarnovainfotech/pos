import api from './api';

export const customerService = {
  // 🔍 Find customer by phone number
  findByPhone(phone) {
    return api.get(`/customers/phone/${phone}`);
  },

  // ➕ Create new customer
  create(data) {
    return api.post('/customers', data);
  }
};
