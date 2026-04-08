import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../services/api';

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    nativeLanguage: 'english',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await userAPI.register(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed!');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.logo}>🎬 CineLingo</div>
        <h2 style={styles.title}>Start Learning Korean!</h2>
        <p style={styles.subtitle}>Create your free account today</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Your Native Language</label>
            <select
              name="nativeLanguage"
              value={form.nativeLanguage}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="telugu">Telugu</option>
              <option value="tamil">Tamil</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="japanese">Japanese</option>
              <option value="chinese">Chinese</option>
            </select>
          </div>

          <button
            type="submit"
            style={loading ? styles.buttonDisabled : styles.button}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account 🎉'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0a0a1a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  box: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
  },
  logo: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#e94560',
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
    textAlign: 'center',
    marginBottom: '30px',
  },
  error: {
    background: 'rgba(233,69,96,0.2)',
    border: '1px solid #e94560',
    borderRadius: '8px',
    padding: '10px',
    color: '#e94560',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '14px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    color: '#ccc',
    marginBottom: '8px',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '16px',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    background: '#1a1a3e',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #e94560, #c73652)',
    color: 'white',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  buttonDisabled: {
    width: '100%',
    padding: '14px',
    background: '#555',
    color: 'white',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  switchText: {
    color: '#888',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
  },
  link: {
    color: '#e94560',
    fontWeight: 'bold',
  },
};

export default Register;