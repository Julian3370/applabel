import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination, Row, Col, Card } from 'react-bootstrap';
import api from '../api';
import './ImageGallery.css';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 9; // 3 columnas * 3 filas = 9 imágenes por página
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await api.get('/image/all');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  const handleImageClick = (imageId) => {
    navigate(`/image/${imageId}`);
  };

  return (
    <div>
      <h1 className="text-center mt-4 mb-4">Galería de Imágenes</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {currentImages.map((image) => (
          <Col key={image.id} onClick={() => handleImageClick(image.id)}>
            <Card className="h-100">
              <Card.Img
                variant="top"
                src={`/imagen/${image.name}`}
                alt={image.name}
                className="gallery-image"
              />
              <Card.Body>
                <Card.Title>{image.name}</Card.Title>
                <Card.Text>
                  {image.description ? image.description : 'Sin descripción'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination className="mt-4 justify-content-center">
        {[...Array(Math.ceil(images.length / imagesPerPage)).keys()].map((number) => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => paginate(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default ImageGallery;
