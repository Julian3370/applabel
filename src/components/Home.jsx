import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <img src="https://www.golden-companies.com/wp-content/uploads/2024/06/Web-Go-300x57.png" alt="Logo" className="home-logo" />
        </header>
      <h1>Golden: Etiquetado de Imágenes</h1>
      <section className="home-news">
        <h2>Noticias</h2>
        <ul>
          <li>Nos complace anunciar el Proyecto  etquetado de magenes Golden</li>
        </ul>
      </section>
      <section className="home-about">
        <h2>¿Qué es Golden?</h2>
        <p>Golden es una empresa dedicada al analisis de tendencias y este proyecto de etquetado de magenes tiene:</p>
        <ul>
          <li>Segmentación de objetos</li>
          <li>Reconocimiento en contexto</li>
          <li>Segmentación de superpíxeles</li>
          <li>7K imágenes (3K etiquetadas)</li>         
        </ul>
      </section>
      <section className="home-collaborators">
        <h2>Colaboradores</h2>     
      </section>
      <section className="home-sponsors">
        
      </section>
    </div>
  );
};

export default Home;
