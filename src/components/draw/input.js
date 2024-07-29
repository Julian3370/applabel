import React, { useState, useEffect, useRef } from "react";

const Input = () => {
  const [brush, setBrush] = useState(2);
  const [color, setColor] = useState("#000000");
  const [tool, setTool] = useState("Polygon");
  const [drawing, setDrawing] = useState(false);
  const [polygons, setPolygons] = useState([]);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const canvasRef = useRef(null);

  const handleBrushChange = (event) => {
    setBrush(event.target.value);
  };

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  const handleToolChange = (event) => {
    setTool(event.target.name);
  };

  const handleCanvasMouseDown = (event) => {
    if (tool === "Polygon") {
      const { offsetX, offsetY } = event.nativeEvent;
      setCurrentPolygon((prev) => [...prev, { x: offsetX, y: offsetY }]);
      setDrawing(true);
    }
  };

  const handleCanvasMouseUp = () => {
    if (tool === "Polygon" && drawing) {
      const label = prompt("Ingrese una etiqueta para el polígono:");
      if (label) {
        setPolygons((prev) => [
          ...prev,
          { points: currentPolygon, label: label },
        ]);
        setCurrentPolygon([]);
      } else {
        setCurrentPolygon([]);
      }
      setDrawing(false);
    }
  };

  const handleSaveToJson = () => {
    const jsonData = JSON.stringify(polygons, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "polygons.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawPolygons = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      polygons.forEach((polygon) => {
        ctx.beginPath();
        polygon.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = brush;
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();
      });
    };

    drawPolygons();
  }, [polygons, brush, color]);

  useEffect(() => {
    console.log(currentPolygon);
  }, [currentPolygon]);

  return (
    <div>
      <div>
        <input
          type="range"
          min="1"
          max="20"
          value={brush}
          name="brush"
          className="slider"
          onChange={handleBrushChange}
        />
        <span> Size: {brush}</span>
      </div>
      <div>
        <input
          type="color"
          name="color"
          value={color}
          onChange={handleColorChange}
        />
        <label htmlFor="color"> Color </label>
      </div>
      <div onClick={handleToolChange}>
        <button
          name="Line"
          style={{
            backgroundColor: tool === "Line" ? "#8080805c" : "unset",
          }}
        >
          Line
        </button>
        <button
          name="Polygon"
          style={{
            backgroundColor: tool === "Polygon" ? "#8080805c" : "unset",
          }}
        >
          Polygon
        </button>
        <button
          name="Rectangle"
          style={{
            backgroundColor: tool === "Rect" ? "#8080805c" : "unset",
          }}
        >
          Rectangle
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width="600"
        height="400"
        style={{ border: "1px solid black" }}
        onMouseDown={handleCanvasMouseDown}
        onMouseUp={handleCanvasMouseUp}
      ></canvas>
      <button onClick={handleSaveToJson}>Guardar Polígonos en JSON</button>
    </div>
  );
};

export default Input;
