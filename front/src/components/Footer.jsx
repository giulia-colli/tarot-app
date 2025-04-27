import React from 'react';
import { Container } from 'react-bootstrap';
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-glass text-light">
      <Container className="d-flex justify-content-between align-items-center h-100">
        {/* Social a sinistra */}
        <div className="d-flex gap-3">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-light fs-5">
            <FaInstagram />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-light fs-5">
            <FaFacebook />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="text-light fs-5">
            <FaTiktok />
          </a>
        </div>

        {/* Admin a destra */}
        <div>
          <Link to="/admin" className="text-light text-decoration-none fw-semibold">
            Area Admin
          </Link>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
