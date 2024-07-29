// import { useEffect, useState, useRef } from "react";
// import Canvas from "react-canvas-polygons";

// const DrawCanvas = ({ initialData = [], onChange, handleFinishDraw , clearCanvas}) => {
//   const [tool, setTool] = useState("Line");
//   const [imgSrc, setImgSrc] = useState("https://distribuidoracto.com.ar/assets/meemba/images/default_product_image.png");
//   const canvasRef = useRef(null);

//   const handleCleanCanva = (e) => {
//     e.stopPropagation();
//     canvasRef.current.cleanCanvas();
//     setTool("Line");
//     const timeout = setTimeout(() => setTool("Polygon"), 50);
//     return () => clearTimeout(timeout);
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImgSrc(e.target.result);
//       };

//       reader.readAsDataURL(file);
//     }

//     canvasRef.current.cleanCanvas();
//     setTool("Line");
//     const timeout = setTimeout(() => setTool("Polygon"), 50);
//     return () => clearTimeout(timeout);
//   };

//   useEffect(() => {
//     const timeout = setTimeout(() => setTool("Polygon"), 50);
//     return () => clearTimeout(timeout);
//   }, []);



//   return (
//     <div>
//       <button
//         variant="outlined"
//         style={{ marginBottom: "20px" }}
//         onClick={handleCleanCanva}
//       >
//         Clean Canvas
//       </button>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImageUpload}
//         style={{ marginBottom: "20px" }}
//       />
//       <div>
//         <Canvas
//           ref={canvasRef}
//           imgSrc={imgSrc}
//           height={800}
//           width={800}
//           tool={tool}
//           onDataUpdate={(data) => onChange(data)}
//           onFinishDraw={handleFinishDraw}
//           initialData={initialData}
//         />
//       </div>
//     </div>
//   );
// };

// export default DrawCanvas;
