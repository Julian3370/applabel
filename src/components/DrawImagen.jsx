import React, { useState, useRef, useEffect } from "react";
import { Container } from "react-bootstrap";
import Canvas from "react-canvas-polygons";
import "./DrawImagen.css"; // Importa el archivo CSS
import api from "../api";

const DrawImagen = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [points, setPoints] = useState([]);
  const [arrayPoints, setArrayPoints] = useState([]);
  const [imgSrc, setImgSrc] = useState(
    "https://distribuidoracto.com.ar/assets/meemba/images/default_product_image.png"
  );
  const [imgDimensions, setImgDimensions] = useState({
    width: 800,
    height: 800,
  });
  const [tool, setTool] = useState("Line");
  const canvasRef = useRef(null);
  const [categoria, setCategoria] = useState("");
  const [fileName, setFileName] = useState("");

  const handleCleanCanvas = (e) => {
    e.stopPropagation();
    setModalIsOpen(false);
    canvasRef.current.cleanCanvas();
    setTool("Line");
    setTimeout(() => setTool("Polygon"), 50);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const img = new Image();
        img.onload = () => {
          setImgSrc(dataUrl);
          setImgDimensions({ width: img.width, height: img.height });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
      const fileNameWithExtension = file.name;
      setFileName(fileNameWithExtension);
      console.log(fileNameWithExtension); // Aquí tienes el nombre del archivo con su extensió
    }
    handleCleanCanvas(e);
  };

  const onChange = (data) => {
    setPoints(data);
    setModalIsOpen(false);
  };

  const handleLabelSave = () => {
    for (const key in points) {
      if (key.startsWith("Polygon")) {
        var points_data = points[key];
      }
    }
    const newPolygon = {
      label,
      categoria,
      points: points_data,
      group_id: null,
      description: "",
      shape_type: "polygon",
      flags: {},
      mask: null,
    };
    console.log(newPolygon);
    setLabel("");
    setModalIsOpen(false);
    setArrayPoints([...arrayPoints, newPolygon]);
  };

  const handleFinishDraw = () => {
    setModalIsOpen(true);
  };

  /*    name: imageFile.name,
        shapes: jsonData.shapes.map(item =>({
          label: item.label,
          points: item.points
        })) ,
        ids: selectedLabels,
        width: jsonData.imageWidth,
        height: jsonData.imageHeight,*/

  const fetchlabel = async () => {
    try {
      const response = await api.get("/label/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching labels:", error);
    }
  };
  const guardarPuntos = async () => {
    await crearEtiqueta();
    const data_label = await fetchlabel();
    const labelMap = new Map();
    const ids=[]
    data_label.forEach((label) => {
      labelMap.set(label.subcategoria.toLowerCase(), label.id);
    });

    for (const point of arrayPoints) {
      const labelLower = point.label.toLowerCase();
      if (labelMap.has(labelLower)) {
        ids.push(labelMap.get(point.label))
      }}
    console.log(data_label);
    const formDataInsert = {
      name: fileName,
      shapes: arrayPoints.map(item =>({
        label: item.label,
        points: item.points
      })) ,
      ids:ids,
      imageHeight: imgDimensions.height,
      imageWidth: imgDimensions.width,
    };
    console.log(formDataInsert);
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

  const crearEtiqueta = async () => {
    const data_label = await fetchlabel();
    //aqui vamos a integrar las etiquetas q hacen falta en nuestras labels con sus categorias
    const labelMap = new Map();
    data_label.forEach((label) => {
      labelMap.set(label.subcategoria.toLowerCase(), label.id);
    });

    for (const point of arrayPoints) {
      const labelLower = point.label.toLowerCase();
      if (!labelMap.has(labelLower)) {
        console.warn(`Label not found: ${point.label}`);
        const formData = {
          categoria: point.categoria,
          subcategoria: point.label,
          cant: 0,
          label: "",
          islogo: false,
        };
        try {
          const response = await fetch(
            "http://localhost:8080/label/insertLabel",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            }
          );

          if (response.ok) {
            console.log("Respuesta del servidor:", response);
          }
        } catch (error) {
          console.error("Error al enviar la solicitud:", error);
        }
      }
    }
  };

  const getImageFileName = (imageUrl) => {
    const urlSegments = imageUrl.split("/");
    console.log(urlSegments[urlSegments.length - 1]);
    return urlSegments[urlSegments.length - 1].split(".")[0]; // Obtener el nombre sin la extensión
  };
  const getImageFileName1 = (imageUrl) => {
    const urlSegments = imageUrl.split("/");
    console.log(urlSegments[urlSegments.length - 1]);
    return urlSegments[urlSegments.length - 1]; // Obtener el nombre sin la extensión
  };

  useEffect(() => {
    setModalIsOpen(false);
    setTimeout(() => setTool("Polygon"), 50);
  }, []);

  return (
    <Container className="container">
      <div className="App row">
        <h1>Dibujar</h1>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button onClick={handleCleanCanvas}>Clean Canvas</button>
        <Canvas
          ref={canvasRef}
          imgSrc={imgSrc}
          height={imgDimensions.height}
          width={imgDimensions.width}
          tool={tool}
          onDataUpdate={onChange}
          onFinishDraw={handleFinishDraw}
          initialData={points}
        />
      </div>
      <button onClick={guardarPuntos}>Guardar</button>

      {modalIsOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Ingrese una etiqueta para el polígono:</h2>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
            <button onClick={handleLabelSave}>Guardar</button>
            <button onClick={() => setModalIsOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default DrawImagen;
