import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await loginRequest({ username, password });
      login(user);

      if (user.role === 'admin') navigate('/admin');
      else navigate('/pos');
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: '100px auto' }}>
      <h2>🔐 POS Login</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <br /><br />
        <button disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
