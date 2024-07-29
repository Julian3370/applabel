import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Update.css';

const Update = () => {
  const [imageId, setImageId] = useState('');
  const [imageDetails, setImageDetails] = useState({ name: '', description: '' });
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setImageDetails({
      ...imageDetails,
      [name]: value,
    });
  };

  const handleLoadImage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8080/imagen/${imageId}`);
      if (response.status === 200) {
        setImageDetails(response.data);
        setResponseType('success');
        setResponseMessage('Imagen cargada correctamente.');
      } else {
        setResponseType('danger');
        setResponseMessage('Error al cargar la imagen.');
      }
    } catch (error) {
      setResponseType('danger');
      setResponseMessage('Error: ' + error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8080/update/${imageId}`, imageDetails);
      if (response.status === 200) {
        setResponseType('success');
        setResponseMessage('Imagen actualizada correctamente.');
      } else {
        setResponseType('danger');
        setResponseMessage('Error al actualizar la imagen.');
      }
    } catch (error) {
      setResponseType('danger');
      setResponseMessage('Error: ' + error.message);
    }
  };

  const handleDrawNewPolygon = () => {
    navigate('/tasks/draw-polygon');
  };

  return (
    <Container className="update-container">
      <h1>Modificar Imagen</h1>
      <Form onSubmit={handleLoadImage}>
        <Form.Group controlId="imageId">
          <Form.Label>ID de la Imagen</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el ID de la imagen"
            value={imageId}
            onChange={(e) => setImageId(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Cargar Imagen
        </Button>
      </Form>
      {imageDetails.name && (
        <Form onSubmit={handleUpdate}>
          <Form.Group controlId="imageName">
            <Form.Label>Nombre de la Imagen</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nuevo nombre de la imagen"
              name="name"
              value={imageDetails.name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="imageDescription">
            <Form.Label>Descripción de la Imagen</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese la nueva descripción de la imagen"
              name="description"
              value={imageDetails.description}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Modificar Imagen
          </Button>
          <Button variant="secondary" onClick={handleDrawNewPolygon} className="mt-2">
            Dibujar Nuevo Polígono
          </Button>
        </Form>
      )}
      {responseMessage && (
        <Alert variant={responseType} className="mt-3">
          {responseMessage}
        </Alert>
      )}
    </Container>
  );
};

export default Update;
