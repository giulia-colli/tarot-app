import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [errore, setErrore] = useState('');
  const navigate = useNavigate();

  // 📩 Registrazione classica
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/register', {
        username,
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/lettura');
    } catch (err) {
      setErrore(err.response?.data?.message || 'Errore di registrazione');
    }
  };

  // 🔐 Registrazione/Login con Google
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:4000/api/auth/google-login', {
        tokenId: credentialResponse.credential,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/lettura');
    } catch (err) {
      setErrore('Errore nella registrazione con Google');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Registrazione</h2>
      {errore && <Alert variant="danger">{errore}</Alert>}

      {/* FORM CLASSICO */}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Inserisci username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Inserisci email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Inserisci password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required />
        </Form.Group>

        <Button variant="success" type="submit" className="w-100">Registrati</Button>
      </Form>

      <div className="text-center my-3">oppure</div>

      {/* GOOGLE LOGIN/REGISTRAZIONE */}
      <div className="d-flex justify-content-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setErrore('Registrazione Google fallita')}
        />
      </div>
    </Container>
  );
};

export default Register;
