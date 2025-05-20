import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function GraficosPorSeccion() {
  const [rutasGraficos, setRutasGraficos] = useState({
    barras: '',
    torta: '',
    lineas: '',
    area: ''
  });

  // Estado para controlar la visibilidad de cada gráfico
  const [visibles, setVisibles] = useState({
    barras: false,
    torta: false,
    lineas: false,
    area: false
  });

  const opcionesGraficos = [
    {
      nombre: "Producción Energía Renovable",
      descripcion: "La producción de energía renovable representa un pilar fundamental en la transición hacia un modelo energético sostenible. A través del aprovechamiento de fuentes como la energía solar, eólica, hidroeléctrica, geotérmica y biomasa, se busca reducir la dependencia de combustibles fósiles y minimizar el impacto ambiental asociado a la generación de electricidad.",
      endpoint: "/grafico/barras",
      clave: "barras"
    },
    {
      nombre: "Participación Energías Renovables",
      descripcion: "El análisis gráfico de la participación de las energías renovables en la matriz energética es fundamental para comprender cómo ha evolucionado el uso de estas fuentes en comparación con las no renovables. A través de diferentes tipos de gráficas, se pueden destacar patrones, avances y desafíos en la adopción de tecnologías limpias.",
      endpoint: "/grafico/torta",
      clave: "torta"
    },
    {
      nombre: "Tendencia Capacidad Instalada",
      descripcion: "La tendencia de la capacidad instalada en energías renovables ha mostrado un crecimiento constante durante la última década. Esta capacidad representa el potencial total de generación eléctrica que un país o región puede alcanzar mediante fuentes limpias como la solar, eólica, hidroeléctrica, geotérmica y biomasa.",
      endpoint: "/grafico/lineas",
      clave: "lineas"
    },
    {
      nombre: "Consumo Renovable vs Convencional",
      descripcion: "El análisis del consumo de energía renovable frente al consumo de energía convencional permite entender cómo se distribuye la demanda energética y qué tanto se ha avanzado en la transición hacia un modelo más sostenible.",
      endpoint: "/grafico/area",
      clave: "area"
    }
  ];

  useEffect(() => {
    opcionesGraficos.forEach(grafico => {
      axios.get(`http://localhost:8000${grafico.endpoint}`)
        .then(response => {
          setRutasGraficos(prev => ({
            ...prev,
            [grafico.clave]: `http://localhost:8000${response.data.ruta}`
          }));
        })
        .catch(error => {
          console.error(`Error al obtener el gráfico ${grafico.nombre}:`, error);
        });
    });
  }, []);

  const mostrarGrafico = clave => {
    setVisibles(prev => ({ ...prev, [clave]: true }));
  };

  const cerrarGrafico = clave => {
    setVisibles(prev => ({ ...prev, [clave]: false }));
  };

  return (
    <section id="graficos" style={{ padding: '1rem 0' }}>
      {opcionesGraficos.map(grafico => (
        <section
          key={grafico.clave}
          style={{
            margin: '2rem 0',
            padding: '1rem',
            border: '1px solid #eee',
            borderRadius: '8px'
          }}
        >
          <h3>{grafico.nombre}</h3>
          <p>{grafico.descripcion}</p>
          {!visibles[grafico.clave] ? (
            <button className="btn btn-success" onClick={() => mostrarGrafico(grafico.clave)}>
              Mostrar gráfico
            </button>
          ) : (
            <>
              {rutasGraficos[grafico.clave] ? (
                <div
                  style={{
                    
                   
                    borderRadius: '8px',
                    padding: '1rem',
                    margin: '1rem 0'
                  }}
                >
                  <img
                    src={rutasGraficos[grafico.clave]}
                    alt={`Gráfico: ${grafico.nombre}`}
                    style={{
                      maxWidth: '100%',
                      height: '100%',
                      display: 'block',
                      margin: '0 auto',
                      padding: '1rem'
                    }}
                  />
                </div>
              ) : (
                <p>Cargando gráfico...</p>
              )}
              <br />
              <button className="btn btn-danger" onClick={() => cerrarGrafico(grafico.clave)}>
                Cerrar gráfico
              </button>
            </>
          )}
        </section>
      ))}
    </section>
  );
}
