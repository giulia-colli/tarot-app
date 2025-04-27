import React from 'react';
import {
  Navbar,
  Nav,
  Container,
  Button,
  NavDropdown,
  Image,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, logout } from '../hooks/useAuth';
import './navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavigationBar = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const username = localStorage.getItem('username');
  const avatar = localStorage.getItem('avatar');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    logout();
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');

  const handleDelete = async () => {
    const conferma = window.confirm('Sei sicuro di voler eliminare il tuo profilo?');
    if (!conferma) return;

    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:4000/api/user/delete', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      logout();
      localStorage.removeItem('username');
      localStorage.removeItem('avatar');
      localStorage.removeItem('isAdmin');
      navigate('/');
    } catch (err) {
      console.error("Errore durante l'eliminazione del profilo:", err);
    }
  };

  return (
    <Navbar fixed="top" expand="lg" className="navbar-glass py-2" collapseOnSelect>
  <Container fluid className="px-3">
    <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-light">
    Arcani Svelati
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="navbar-responsive" />
    <Navbar.Collapse id="navbar-responsive">
      {/* 🔹 Nav link a sinistra */}
      <Nav className="me-auto my-2 my-lg-0 gap-lg-4 gap-2">
        <Nav.Link as={Link} to="/">Home</Nav.Link>
        <Nav.Link as={Link} to="/lettura">Lettura</Nav.Link>
        <Nav.Link as={Link} to="/carte">Tarocchi</Nav.Link>
      </Nav>

      {/* 🔹 Parte destra */}
      <Nav className="ms-auto align-items-center gap-3 mt-2 mt-lg-0">
        {loggedIn ? (
          <>
            {username && (
              <>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-light">Hi, {username}</span>
                  <Image
  src={avatar || process.env.PUBLIC_URL + '/img/default-avatae.jpg'}
  alt="Avatar"
  roundedCircle
  width={32}
  height={32}
  style={{ objectFit: 'cover' }}
/>
                </div>

                {/* 🔄 Spostato qui a destra */}
                <NavDropdown title="Profilo" id="profilo-dropdown" align="end">
                  {isAdmin ? (
                    <NavDropdown.Item as={Link} to="/admin/dashboard">
                      Gestisci carte
                    </NavDropdown.Item>
                  ) : (
                    <>
                      <NavDropdown.Item as={Link} to="/profilo">Visualizza</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/profilo/modifica">Modifica</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleDelete}>Elimina profilo</NavDropdown.Item>
                    </>
                  )}
                </NavDropdown>

                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="d-flex flex-column flex-lg-row gap-2">
            <Button variant="outline-light" onClick={handleLogin}>
              Login
            </Button>
            <Button variant="outline-light" onClick={handleRegister}>
              Registrati
            </Button>
          </div>
        )}
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

  );
};

export default NavigationBar;



