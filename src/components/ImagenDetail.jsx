import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Button } from 'react-bootstrap';

const ImageDetail = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [polygons, setPolygons] = useState([]); // Estado para manejar múltiples polígonos
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await api.get(`/image/get/${id}`);
        setImage(response.data);
        setShapes(response.data.shapes);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [id]);

  useEffect(() => {
    if (!image) {
      return; // No hacer nada si no hay imagen
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = `/imagen/${image.name}`;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas antes de dibujar

      // Dibujar la imagen
      ctx.drawImage(img, 0, 0);

      // Dibujar todos los polígonos
      polygons.forEach(polygon => {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Relleno rojo semi-transparente
        ctx.beginPath();
        polygon.points.forEach(([x, y], index) => {
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.closePath();
        ctx.fill();

        // Dibujar los puntos del polígono como círculos
        ctx.fillStyle = 'blue'; // Color de los puntos
        ctx.strokeStyle = 'white'; // Borde blanco para los puntos
        ctx.lineWidth = 2; // Ancho del borde
        polygon.points.forEach(([x, y]) => {
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        });
      });
    };
  }, [image, polygons]);

  const handleLabelClick = (label) => {
    console.log("hago click")
    const labelPolygons = shapes.filter(shape => shape.label === label);
   
    const newPolygons = [];
    for (let i = 0; i < labelPolygons.length; i++) {
      console.log(labelPolygons[i].points)
      newPolygons.push({ points: labelPolygons[i].points });
    }
    setPolygons(newPolygons); // Filtrar y añadir polígonos de la etiqueta
  };

  if (!image) {
    return <div>Loading...</div>;
  }

  return (
    <div className="image-detail">
      <h1>{image.name}</h1>
      <img src={`/imagen/${image.name}`} alt={image.name} />

      <div className="mt-4">
        <h2 className="text-center">Poligonos</h2>
        {[...new Set(shapes.map(shape => shape.label))].map((label, index) => (
          <Button key={index} onClick={() => handleLabelClick(label)} className="m-2">
            {label}
          </Button>
        ))}
      </div>

      <canvas ref={canvasRef} style={{ border: '1px solid black', marginTop: '20px' }} />
    </div>
  );
};

export default ImageDetail;
