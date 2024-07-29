import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import MainLayout from './layouts/MainLayout';
import ImageGallery from './components/ImageGallery';
import Dashboard from './layouts/Dashboard'
import './App.css';
import InsertImage from './components/InsertImagen';
import ImageDetail from './components/ImagenDetail';
import DrawImagen from './components/DrawImagen';
import Delete from './components/Delete';
import Update from './components/Update';
//import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <MainLayout>
      <Routes>
      <Route path="/home" element={<Home />} />  {/* Añade la ruta para ImageGallery */}
        <Route path="/gallery" element={<ImageGallery />} />  {/* Añade la ruta para ImageGallery */}
        <Route path="/tasks" element={<Dashboard />}>
          <Route path="insert-imagen" element={<InsertImage />} />
          <Route path="draw-polygon" element={<DrawImagen />} />
          <Route path="delete" element={<Delete />} />
          <Route path="update" element={<Update />} />
        </Route>
        <Route path="/image/:id" element={<ImageDetail/>} />
        <Route path='/tasks/insert-imagen' element={<InsertImage/>}/>
      </Routes>
    </MainLayout>
  );
}

export default App;
