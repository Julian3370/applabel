import React from 'react';
import './MainLayout.css';
import { Row, Col, Nav, Container } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Container fluid>
        <Row>
          <Col xs={12} md={2} id="sidebar-wrapper">
            <Nav className="flex-column">
              <Nav.Link as={Link} to="insert-imagen">Insertar Imagen</Nav.Link>
              <Nav.Link as={Link} to="draw-polygon">Dibujar Polígono</Nav.Link>
              <Nav.Link as={Link} to="delete">Eliminar</Nav.Link>
              <Nav.Link as={Link} to="update">Modificar</Nav.Link>
            </Nav>
          </Col>
          <Col xs={12} md={10} id="page-content-wrapper">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
