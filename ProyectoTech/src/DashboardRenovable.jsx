import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardRenovable() {
    const [datos, setDatos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get('http://localhost:8000/datos/historicos')
            .then(res => {
                console.log('Datos recibidos en DashboardRenovable:', res.data);
                setDatos(res.data);
            })
            .catch(() => setError('Error al cargar los datos'));
    }, []);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!datos.length) return <p>Cargando dashboard...</p>;

    const anios = datos.map(fila => Number(fila.Year));
    const anioMax = Math.max(...anios);

    const datosRecientes = datos.filter(fila => Number(fila.Year) === anioMax);

    const sumaPorcentajes = datosRecientes.reduce(
        (acc, fila) => acc + (Number(fila["Renewables (% equivalent primary energy)"]) || 0), 0
    );
    const promedioRenovable = sumaPorcentajes / datosRecientes.length;

    return (
        <section id="dashboard" className="container pt-5">
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card text-center p-3">
                        <h5>Año más reciente</h5>
                        <p>{anioMax}</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card text-center p-3">
                        <h5>Promedio mundial de energía renovable (%)</h5>
                        <p>{promedioRenovable.toFixed(2)}%</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
