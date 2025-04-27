import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import './Profilo.css';

const Profilo = () => {
  const [letture, setLetture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState('');
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLetture = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/readings/storico', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLetture(res.data);
      } catch (err) {
        setErrore('Errore nel recupero dello storico delle letture.');
      } finally {
        setLoading(false);
      }
    };

    fetchLetture();
  }, [token]);

  // ✅ Funzione elimina lettura
  const handleDeleteReading = async (id) => {
    const conferma = window.confirm('Sei sicuro di voler eliminare questa lettura?');
    if (!conferma) return;

    try {
      await axios.delete(`http://localhost:4000/api/readings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Aggiorna lista senza ricaricare la pagina
      setLetture((prevLetture) => prevLetture.filter((lettura) => lettura._id !== id));
    } catch (err) {
      setErrore('Errore durante l\'eliminazione della lettura.');
    }
  };

  return (
    <Container className="mt-5 profilo-container">
      <h2 className="mb-4">Profilo di {username}</h2>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {errore && <Alert variant="danger">{errore}</Alert>}

      {!loading && letture.length === 0 && (
        <Alert variant="info">Non hai ancora effettuato nessuna lettura.</Alert>
      )}

      <Row className="gy-4">
        {letture.map((lettura) => (
          <Col md={12} key={lettura._id}>
            <Card className="shadow-sm lettura-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Lettura del:</strong>{' '}
                  {new Date(lettura.date).toLocaleString('it-IT', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </div>

                {/* 🔥 Bottone elimina */}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteReading(lettura._id)}
                >
                  Elimina
                </Button>
              </Card.Header>

              <Card.Body>
                <Row className="gy-3">
                  {lettura.cards.map((card, index) => (
                    <Col key={index} xs={6} md={3}>
                      <Card className="h-100">
                        <Card.Img variant="top" src={card.immagine} alt={card.nome} />
                        <Card.Body>
                          <Card.Title style={{ fontSize: '1rem' }}>{card.nome}</Card.Title>
                          <Card.Text style={{ fontSize: '0.85rem' }}>
                            {card.descrizione}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Profilo;
