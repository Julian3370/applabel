import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import './Delete.css';

const Delete = () => {
  const [imageId, setImageId] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`http://localhost:8080/image/delete/${imageId}`);
      if (response.status === 200) {
        setResponseType('success');
        setResponseMessage('Imagen eliminada correctamente.');
      } else {
        setResponseType('danger');
        setResponseMessage('Error al eliminar la imagen.');
      }
    } catch (error) {
      setResponseType('danger');
      setResponseMessage('Error: ' + error.message);
    }
  };

  return (
    <Container className="delete-container">
      <h1>Eliminar Imagen</h1>
      <Form onSubmit={handleDelete}>
        <Form.Group controlId="imageId">
          <Form.Label>ID de la Imagen</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el ID de la imagen"
            value={imageId}
            onChange={(e) => setImageId(e.target.value)}
          />
        </Form.Group>
        <Button variant="danger" type="submit">
          Eliminar Imagen
        </Button>
      </Form>
      {responseMessage && (
        <Alert variant={responseType} className="mt-3">
          {responseMessage}
        </Alert>
      )}
    </Container>
  );
};

export default Delete;
