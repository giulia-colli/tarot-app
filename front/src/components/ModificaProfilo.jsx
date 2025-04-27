import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Spinner, Image } from 'react-bootstrap';

const ModificaProfilo = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [preview, setPreview] = useState('');
  const [successo, setSuccesso] = useState('');
  const [errore, setErrore] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Carica dati esistenti
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(res.data.username);
        setEmail(res.data.email);
        setAvatar(res.data.avatar || '');
        setPreview(res.data.avatar || '');
      } catch (err) {
        setErrore('Errore nel caricamento del profilo.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  // Upload su Cloudinary
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'tarocchi_profilo');
    formData.append('cloud_name', 'dbyxxcrtn');

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dbyxxcrtn/image/upload',
        formData
      );
      setAvatar(res.data.secure_url);
      setPreview(res.data.secure_url);
    } catch (err) {
      setErrore('Errore nel caricamento dell\'immagine');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore('');
    setSuccesso('');

    try {
      await axios.put(
        'http://localhost:4000/api/user/update',
        { username, email, password, avatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem('username', username);
      if (avatar) localStorage.setItem('avatar', avatar);

      setSuccesso('Profilo aggiornato con successo!');
    } catch (err) {
      setErrore(err.response?.data?.message || 'Errore durante l\'aggiornamento.');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Modifica Profilo</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {errore && <Alert variant="danger">{errore}</Alert>}
          {successo && <Alert variant="success">{successo}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nuova Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Lascia vuoto se non vuoi cambiarla"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Immagine profilo</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleUpload} />
              {preview && (
                <Image
                  src={preview}
                  roundedCircle
                  alt="Anteprima avatar"
                  width={100}
                  className="mt-3"
                />
              )}
            </Form.Group>

            <Button variant="primary" type="submit">
              Salva modifiche
            </Button>
          </Form>
        </>
      )}
    </Container>
  );
};

export default ModificaProfilo;
