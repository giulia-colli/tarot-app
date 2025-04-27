import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Form } from 'react-bootstrap';
import axios from 'axios';
import './Tarocchi.css'; // Importa il file CSS per lo stile

const Tarocchi = () => {
  const [carte, setCarte] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchCarte = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/cards');
        setCarte(res.data);
        setLoading(false);
      } catch (err) {
        setErrore('Errore nel recupero delle carte');
        setLoading(false);
      }
    };

    fetchCarte();
  }, []);

  const carteFiltrate = carte.filter((carta) =>
    carta.nome.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Le Carte dei Tarocchi</h2>

      {/* 🔍 Campo ricerca */}
      <Form className="mb-4 search-bar" >
        <Form.Control
          type="text"
          placeholder="Cerca una carta per nome..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Form>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : errore ? (
        <Alert variant="danger">{errore}</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {carteFiltrate.length === 0 ? (
            <p className="text-center">Nessuna carta trovata</p>
          ) : (
            carteFiltrate.map((carta) => (
              <Col key={carta._id}>
                <Card className="h-100 tarot-card">
                  <Card.Img
                    variant="top"
                    src={carta.immagine}
                    alt={carta.nome}
                    className="card-img-original"
                  />
                  <Card.Body>
                    <Card.Title>
                      {carta.numero}. {carta.nome}
                    </Card.Title>
                    <Card.Text>{carta.descrizione}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
};

export default Tarocchi;
