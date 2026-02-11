import api from './api';

export const dashboardService = {
  getOverview() {
    return api.get('/dashboard');
  }
};
