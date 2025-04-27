import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errore, setErrore] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore('');

    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      if (!user.isAdmin) {
        setErrore('Accesso riservato solo all’amministratore');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('username', user.username);
      localStorage.setItem('avatar', user.avatar || '');
      localStorage.setItem('isAdmin', user.isAdmin); // ✅ uso del valore reale

      navigate('/admin/dashboard');
    } catch (err) {
      setErrore('Credenziali non valide o errore di accesso');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Login Admin</h2>
      {errore && <Alert variant="danger">{errore}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email admin</Form.Label>
          <Form.Control
            type="email"
            placeholder="Inserisci email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Inserisci password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="dark" className="w-100">
          Accedi
        </Button>
      </Form>
    </Container>
  );
};

export default AdminLogin;

