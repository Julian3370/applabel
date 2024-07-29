import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { BsFileImage, BsFileCode } from "react-icons/bs";
import api from "../api";
import './InsertImagen.css'; // Importa el archivo CSS

const InsertImage = () => {
  const [imageFile, setImageFile] = useState(null);
  const [jsonFile, setJsonFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [missingTags, setMissingTags] = useState([]);
  const [isLogo, setIsLogo] = useState("");
  const [labels, setLabels] = useState([]); 
  const [selectedLabels, setSelectedLabels] = useState([]);
  
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

  const handleImageDrop = (e) => {
    e.preventDefault();
    const image = e.dataTransfer.files[0];
    if (image && image.type.startsWith("image")) {
      setImageFile(image);
    } else {
      alert("Por favor, selecciona un archivo de imagen válido (jpg, png, etc).");
    }
  };

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
    if (fileType === "image" && file.type.startsWith("image")) {
      setImageFile(file);
    } else if (fileType === "json" && file.type === "application/json") {
      setJsonFile(file);
    } else {
      alert("Por favor, selecciona un archivo válido.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (imageFile && jsonFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          const shapes = jsonData.shapes;
          const missingTags = [];

          const processShapes = async () => {
            for (const element of shapes) {
              try {
                const label = await fetchImage(element.label);
                if (label === -1) {
                  missingTags.push(element.label);
                }
              } catch (error) {
                console.error("Error al procesar elemento:", error);
              }
            }
          };

          await processShapes();
          setMissingTags(missingTags);
        } catch (error) {
          console.error("Error al leer el archivo JSON:", error);
        }
      };
      reader.readAsText(jsonFile);
    } else {
      alert("Por favor, selecciona ambos archivos.");
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
        name: imageFile.name,
        shapes: jsonData.shapes.map(item =>({
          label: item.label,
          points: item.points
        })) ,
        ids: selectedLabels,
        width: jsonData.imageWidth,
        height: jsonData.imageHeight,
      };
      console.log("FormData prepared: ", formDataInsert);

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
              onDrop={handleImageDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <BsFileImage size={50} color="#007bff" className="mb-2" />
              <p>Arrastra la imagen aquí o selecciona un archivo de imagen:</p>
              <Form.Control
                type="file"
                onChange={(e) => handleFileChange(e, "image")}
              />
            </div>
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
              Analizar Imagen
            </Button>
          </Form>
        </Col>
      </Row>

      {missingTags.length > 0 && (
        <div className="mt-4">
          <h3>Etiquetas de la imagen:</h3>
          <ul>
            {missingTags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>
      )}

      <Form.Group controlId="multiple-select">
        <Form.Label>Selecciona etiquetas</Form.Label>
        <Form.Control
          as="select"
          multiple
          value={selectedLabels}
          onChange={handleSelectChange}
        >
          {labels.map((label) => (
            <option key={label.id} value={label.id}>
              {label.subcategoria}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

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

const fetchImage = async (label) => {
  try {
    const response = await api.get(`/label/getid/${label}`);
    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error fetching image:", error);
    return -1;
  }
};

export default InsertImage;
