import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../contexts/AuthContext';

export default function AuthPage() {
  const { register, login, loading, setLoading } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register(email, password);
        toast.success(`Реєстрація успішна`);
      } else {
        await login(email, password);
        toast.success(`Авторизація успішна`);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || 'Помилка')
    }
  };

  return (
    <div className="auth-container">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Будь ласка зачекайте...' : isRegister ? 'Реєстрація' : 'Авторизація'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <p
        className="toggle"
        onClick={() => {
          setIsRegister(!isRegister);
          setError('');
        }}
      >
        {isRegister ? 'Вже маєте обліковий запис? Увійти': "Немаєте облікового запису? Зареєструватися"}
      </p>
    </div>
  );
}