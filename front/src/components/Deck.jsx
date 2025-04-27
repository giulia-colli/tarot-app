import React, { useEffect, useState } from 'react';
import './Deck.css';
import axios from 'axios';
import { Toast, ToastContainer, Container, Row, Col } from 'react-bootstrap';

const Deck = () => {
  const [allCards, setAllCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [showCards, setShowCards] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [toastMsg, setToastMsg] = useState('');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/cards');
        setAllCards(res.data);
      } catch (err) {
        console.error('Errore caricamento carte:', err);
      }
    };
    fetchCards();
  }, []);

  const salvaLettura = async (cards) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.post('http://localhost:4000/api/readings', { cards }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setToastType('success');
      setToastMsg('✅ Lettura salvata con successo!');
      setShowToast(true);
    } catch (err) {
      console.error('❌ Errore nel salvataggio della lettura:', err);
      setToastType('danger');
      setToastMsg('❌ Errore nel salvataggio della lettura');
      setShowToast(true);
    }
  };

  const handleClick = () => {
    if (allCards.length < 4) return;

    const shuffled = [...allCards].sort(() => 0.5 - Math.random());
    const randomFour = shuffled.slice(0, 4);
    setSelectedCards(randomFour);
    setShowCards(true);
    setSelectedCard(null);
    salvaLettura(randomFour);
  };

  const handleCardClick = (card, index) => {
    const el = document.querySelector(`.card${index + 1}`);
    if (el) el.classList.toggle('flipped');
    setSelectedCard(card);
  };

  return (
    <>
      <Container className="deck-page py-4">
        {username && (
          <h3 className="text-center mb-4">Welcome, {username}!</h3>
        )}

        {/* Mazzo */}
        <Row className="justify-content-center mb-4">
          <Col xs="auto">
            <div
              className="deck"
              onClick={handleClick}
              style={{
                backgroundImage: `url(/img/back.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
          </Col>
        </Row>

        {/* Carte estratte */}
        <Row className="justify-content-center gy-4">
          {selectedCards.map((card, index) => (
            <Col xs={6} sm={4} md={3} lg={2} key={card._id || index} className="d-flex justify-content-center">
              <div
                className={`card-wrapper card${index + 1} ${showCards ? 'show' : ''}`}
                onClick={() => handleCardClick(card, index)}
              >
                <div className="card-inner">
                  <div
                    className="card-face card-back"
                    style={{
                      backgroundImage: `url(/img/back.png)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  ></div>
                  <div
                    className="card-face card-front"
                    style={{
                      backgroundImage: `url(${card.immagine})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    title={card.nome}
                  ></div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Carta selezionata */}
      {selectedCard && (
        <Container className="selected-card-container mt-5 mb-5">
          <Row className="justify-content-center align-items-start g-4">
            <Col xs={10} sm={5} md={3}>
              <div
                className="selected-card-image"
                style={{
                  backgroundImage: `url(${selectedCard.immagine})`,
                }}
              ></div>
            </Col>
            <Col xs={12} sm={7} md={5}>
              <div className="selected-card-info pergamena">
                <button
                  className="close-btn"
                  onClick={() => setSelectedCard(null)}
                  aria-label="Chiudi"
                >
                  ✕
                </button>
                <h4>{selectedCard.nome}</h4>
                <p>{selectedCard.descrizione}</p>
              </div>
            </Col>
          </Row>
        </Container>
      )}

      {/* Toast */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg={toastType}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Deck;
