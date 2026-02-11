const API_URL = 'http://127.0.0.1:3001/api';

export default {
  async request(method, url, data) {
    const token = localStorage.getItem('TOKEN');

    const res = await fetch(API_URL + url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      },
      body: data ? JSON.stringify(data) : undefined
    });

    return res.json();
  },

  get(url) { return this.request('GET', url); },
  post(url, data) { return this.request('POST', url, data); },
  put(url, data) { return this.request('PUT', url, data); },
  delete(url) { return this.request('DELETE', url); }
};
