import React, { useEffect, useState } from 'react';
import {
  Container,
  Table,
  Button,
  Form,
  Modal,
  Row,
  Col,
  Alert,
} from 'react-bootstrap';
import axios from 'axios';

const AdminDashboard = () => {
  const [cards, setCards] = useState([]);
  const [formData, setFormData] = useState({
    numero: '',
    nome: '',
    descrizione: '',
    immagine: '',
  });
  const [editingCardId, setEditingCardId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errore, setErrore] = useState('');
  const [successo, setSuccesso] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');

  const token = localStorage.getItem('token');

  const fetchCards = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/cards');
      setCards(res.data);
    } catch (err) {
      console.error('Errore caricamento carte:', err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setErrore('');
    setPreview(URL.createObjectURL(file));

    const formDataImg = new FormData();
    formDataImg.append('file', file);
    formDataImg.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formDataImg
      );

      setFormData((prev) => ({
        ...prev,
        immagine: res.data.secure_url,
      }));
    } catch (err) {
      setErrore('Errore durante il caricamento immagine');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (card) => {
    setFormData(card);
    setPreview(card.immagine);
    setEditingCardId(card._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const conferma = window.confirm('Vuoi davvero eliminare questa carta?');
    if (!conferma) return;

    try {
      await axios.delete(`http://localhost:4000/api/cards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccesso('Carta eliminata con successo');
      fetchCards();
    } catch (err) {
      setErrore('Errore durante l’eliminazione');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore('');
    setSuccesso('');

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      if (editingCardId) {
        await axios.put(
          `http://localhost:4000/api/cards/${editingCardId}`,
          formData,
          config
        );
        setSuccesso('Carta modificata con successo');
      } else {
        await axios.post('http://localhost:4000/api/cards', formData, config);
        setSuccesso('Carta aggiunta con successo');
      }

      setFormData({ numero: '', nome: '', descrizione: '', immagine: '' });
      setPreview('');
      setEditingCardId(null);
      setShowModal(false);
      fetchCards();
    } catch (err) {
      setErrore('Errore nel salvataggio');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Pannello Admin - Carte Tarocchi</h2>

      {errore && <Alert variant="danger">{errore}</Alert>}
      {successo && <Alert variant="success">{successo}</Alert>}

      <Button variant="dark" className="mb-3" onClick={() => setShowModal(true)}>
        ➕ Aggiungi nuova carta
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Descrizione</th>
            <th>Immagine</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card._id}>
              <td>{card.numero}</td>
              <td>{card.nome}</td>
              <td>{card.descrizione}</td>
              <td>
                <img
                  src={card.immagine}
                  alt={card.nome}
                  width="50"
                  height="70"
                  style={{ objectFit: 'cover' }}
                />
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleEdit(card)}
                  className="me-2"
                >
                  ✏️
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(card._id)}
                >
                  🗑
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal per inserimento/modifica */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCardId ? 'Modifica Carta' : 'Nuova Carta'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Label>Numero</Form.Label>
                <Form.Control
                  type="number"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descrizione"
                value={formData.descrizione}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Carica immagine</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
              {uploading && <small>Caricamento in corso...</small>}
              {preview && (
                <img
                  src={preview}
                  alt="Anteprima"
                  style={{ width: '80px', marginTop: '10px', borderRadius: '6px' }}
                />
              )}
            </Form.Group>

            <Button type="submit" variant="success" className="w-100">
              {editingCardId ? 'Salva modifiche' : 'Aggiungi'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
