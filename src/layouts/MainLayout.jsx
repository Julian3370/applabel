// MainLayout.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <Container fluid>
        {children}
        <Outlet />
      </Container>
    </div>
  );
};

export default MainLayout;
