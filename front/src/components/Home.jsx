import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import './Home.css';
import { Button } from 'react-bootstrap';

const Home = () => {
  const [sfondoAlternativo, setSfondoAlternativo] = useState(false);

  const toggleSfondo = () => {
    const body = document.body;
    if (sfondoAlternativo) {
      body.style.backgroundImage = "url('/sfondo/sfondo1.png')";
      body.classList.remove('dark-mode'); // ➡️ rimuoviamo la classe se torniamo a sfondo1
    } else {
      body.style.backgroundImage = "url('/sfondo/sfondo2.png')";
      body.classList.add('dark-mode'); // ➡️ aggiungiamo la classe se andiamo su sfondo2
    }
    setSfondoAlternativo(!sfondoAlternativo);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">
        "Il tuo destino ti sta chiamando! Iscriviti ora e svela i segreti che le carte hanno in serbo per te"
      </h2>

      {/* 🔀 Switch grafico */}
      <div className="d-flex justify-content-center align-items-center gap-2 mb-5">
        <Form.Check 
          type="switch"
          id="custom-switch"
          label={sfondoAlternativo ? "Light mode" : "Dark mode"}
          checked={sfondoAlternativo}
          onChange={toggleSfondo}
        />
      </div>

      <Row className="gy-4">
        <Col md={6}>
          <div className="home-box">
            <h3>Scopri il tuo destino</h3>
            <p>Affida le tue domande alle carte: inizia ora la tua lettura personalizzata e lasciati guidare dal potere degli Arcani.</p>
            <a href="/lettura" className="amazon-btn">
              Fai la tua lettura
            </a>
          </div>
        </Col>

        <Col md={6}>
          <div className="home-box">
            <h3>Incontra gli Arcani</h3>
            <p>Esplora ogni carta, scopri il suo significato e lasciati ispirare dai messaggi nascosti del tuo destino.</p>
            <a href="/carte" className="amazon-btn">
              Scopri i Tarocchi
            </a>
          </div>
        </Col>

        <Col md={6}>
          <div className="home-box">
            <h3>Set di Tarocchi consigliato</h3>
            <p>Un mazzo ispirato alla tradizione, perfetto per chi vuole iniziare o approfondire l'arte della divinazione.</p>
            <a
              href="https://www.amazon.it/"
              className="amazon-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vai su Amazon
            </a>
          </div>
        </Col>

        <Col md={6}>
          <div className="home-box">
            <h3>Libro consigliato</h3>
            <p>Una guida chiara e completa per interpretare i Tarocchi, con significati e esercizi pratici.</p>
            <a
              href="https://www.amazon.it/"
              className="amazon-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Scopri su Amazon
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
