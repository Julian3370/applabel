import React, { useState, useEffect } from 'react';
import { Pagination, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
//import './ImageGallery.css';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 10;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('/api/images');  // Asegúrate de que esta URL es correcta y tu backend está sirviendo los datos
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="image-gallery">
      <Row>
        {currentImages.map((image, index) => (
          <Col key={index} sm={6} md={4} lg={3} className="mb-4">
            <Image
              src={image}
              thumbnail
              className="gallery-image"
              alt={`Imagen ${index + 1}`}
              onError={(e) => console.log('Error cargando imagen:', e.target.src)}  // Debug
            />
          </Col>
        ))}
      </Row>
      <Pagination>
        {[...Array(Math.ceil(images.length / imagesPerPage)).keys()].map((number) => (
          <Pagination.Item key={number + 1} onClick={() => paginate(number + 1)} active={number + 1 === currentPage}>
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default ImageGallery;
