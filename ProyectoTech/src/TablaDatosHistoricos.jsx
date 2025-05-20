import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TablaDatosHistoricos() {
    const [datos, setDatos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/datos/historicos')
            .then(res => {
                console.log('Datos recibidos en TablaDatosHistoricos:', res.data);
                setDatos(res.data);
            })
            .catch(() => setError('Error al cargar los datos'));
    }, []);

    return (
        <div class="card p-4 mb-4">
            <h4>Datos históricos de energía renovable</h4>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {/* Muestra el primer objeto para depuración */}
            
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                    <table className="table table-striped table-bordered table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Entidad</th>
                                <th>Código</th>
                                <th>Año</th>
                                <th>% Renovable (energía primaria equivalente)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datos.map((fila, idx) => (
                                <tr key={idx}>
                                    <td>{fila.Entity}</td>
                                    <td>{fila.Code}</td>
                                    <td>{fila.Year}</td>
                                    <td>{fila["Renewables (% equivalent primary energy)"]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
    );
}