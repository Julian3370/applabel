import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { BsFileCode } from "react-icons/bs";
import api from "../api";
import Canvas from "react-canvas-polygons";
import './InsertImagen.css';

const InsertImage = () => {
  const [jsonFile, setJsonFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [missingTags, setMissingTags] = useState([]);
  const [isLogo, setIsLogo] = useState("");
  const [labels, setLabels] = useState([]); 
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [imgSrc, setImgSrc] = useState("");
  const [imgDimensions, setImgDimensions] = useState({ width: 800, height: 800 });
  const [points, setPoints] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await api.get("/label/all");
        setLabels(response.data);
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };

    fetchLabels();
  }, []);

  const handleJsonDrop = (e) => {
    e.preventDefault();
    const json = e.dataTransfer.files[0];
    if (json && json.type === "application/json") {
      setJsonFile(json);
    } else {
      alert("Por favor, selecciona un archivo JSON válido.");
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === "json" && file.type === "application/json") {
      setJsonFile(file);
    } else {
      alert("Por favor, selecciona un archivo válido.");
    }
  };

  const fetchLabels = async () => {
    try {
      const response = await api.get("/label/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching labels:", error);
      return [];
    }
  };

  const processShapes = async (shapes, allLabels) => {
    const missingTags = [];
    const allLabelsLower = allLabels.map(label => label.subcategoria.toLowerCase());

    for (const element of shapes) {
      const elementLabelLower = element.label.toLowerCase();
      console.log(elementLabelLower)
      console.log(element.label)
      if (!allLabelsLower.includes(elementLabelLower)) {
        missingTags.push(element.label);
      }
    }
    
    setMissingTags(missingTags);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jsonFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          console.log(jsonData)
          const shapes = jsonData.shapes;
          const missingTags = [];
          const allLabels = await fetchLabels()

          await processShapes(shapes, allLabels);

          if (missingTags.length === 0) {
            console.log("no hay etiquetas q no se encuentren ingresadas")
            console.log(jsonData.imageHeight)
            setImgSrc(`data:image/jpeg;base64,${jsonData.imageData}`);
            setImgDimensions({ width: jsonData.imageWidth, height: jsonData.imageHeight });
            console.log(shapes[0].points)
            setPoints(shapes[0].points); // Asume que shapes tiene la estructura que espera Canvas

          } else {
            console.log(missingTags)
          }

        } catch (error) {
          console.error("Error al leer el archivo JSON:", error);
        }
      };
      reader.readAsText(jsonFile);
    } else {
      alert("Por favor, selecciona un archivo JSON.");
    }
  };

  const prepareFormData = async () => {
    if (!jsonFile) {
      alert("Por favor, selecciona un archivo JSON.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const jsonData = JSON.parse(event.target.result);
      const formDataInsert = {
        name: jsonFile.name,
        shapes: jsonData.shapes.map(item => ({
          label: item.label,
          points: item.points
        })),
        ids: selectedLabels,
        width: jsonData.imageWidth,
        height: jsonData.imageHeight,
      };
      console.log("FormData prepared: ", formDataInsert);

      // Uncomment and adjust the following code to send the form data to the backend
      /*
      try {
        const response = await fetch('http://localhost:8080/image/insert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formDataInsert),
        });

        if (!response.ok) {
          throw new Error('Error en la solicitud al backend');
        }
        console.log(response)

        // Realiza alguna acción con la respuesta del backend si es necesario
      } catch (error) {
        console.error('Error al enviar los datos al backend:', error);
      }
      */
    };
    reader.readAsText(jsonFile);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleTagSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      categoria: e.target.elements.categoria.value,
      subcategoria: e.target.elements.subcategoria.value,
      cant: 0,
      label: "",
      islogo: e.target.elements.islogo.value,
    };

    try {
      const response = await fetch("http://localhost:8080/label/insertLabel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Respuesta del servidor:", response);
      }

      setIsLogo("");
      setShowModal(false);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  const handleSelectChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (const option of options) {
      if (option.selected) {
        selected.push(option.value);
      }
    }
    setSelectedLabels(selected);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Subir Archivos</h2>
          <Form onSubmit={handleSubmit}>
            <div
              className="drop-zone text-center mb-4"
              onDrop={handleJsonDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <BsFileCode size={50} color="#007bff" className="mb-2" />
              <p>Arrastra el archivo JSON aquí o selecciona un archivo JSON:</p>
              <Form.Control
                type="file"
                onChange={(e) => handleFileChange(e, "json")}
              />
            </div>
            <Button variant="primary" type="submit" block>
              Analizar JSON
            </Button>
          </Form>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        {imgSrc && (
          <Canvas
            ref={canvasRef}
            imgSrc={imgSrc}
            height={imgDimensions.height}
            width={imgDimensions.width}
            initialData={points}
          />
        )}
      </Row>

      <Button variant="secondary" onClick={() => setShowModal(true)} className="mt-4">
        Insertar Nueva Etiqueta
      </Button>

      <Button variant="secondary" onClick={prepareFormData} className="mt-4">
        Preparar FormData
      </Button>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de Etiqueta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Etiqueta seleccionada:</h4>
          <Form onSubmit={handleTagSubmit}>
            <Form.Group controlId="categoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="subcategoria">
              <Form.Label>Subcategoría (nombre de la etiqueta)</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="islogo">
              <Form.Label>¿Es un logo?</Form.Label>
              <Form.Control
                as="select"
                value={isLogo}
                onChange={(e) => setIsLogo(e.target.value)}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default InsertImage;
