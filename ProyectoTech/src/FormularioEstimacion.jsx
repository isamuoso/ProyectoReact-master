import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FormularioEstimacion() {
    const [consumo, setConsumo] = useState('');
    const [porcentajeRenovable, setPorcentajeRenovable] = useState(null);
    const [consumoRenovable, setConsumoRenovable] = useState(null);
    const [datos, setDatos] = useState([]);
    const [paises, setPaises] = useState([]);
    const [pais, setPais] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/datos/historicos')
            .then(res => {
                setDatos(res.data);
                // Extraer lista única de países, limpiar espacios y filtrar vacíos
                const listaPaises = [
                    ...new Set(
                        res.data
                            .map(fila => (fila.Entity || '').trim())
                            .filter(p => p.length > 0)
                    )
                ].sort();
                setPaises(listaPaises);
            })
            .catch(() => setError('Error al cargar los datos'));
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        if (!consumo || !pais) return;
        // Filtrar datos por país seleccionado (limpiando espacios)
        const datosPais = datos.filter(fila => (fila.Entity || '').trim() === pais);
        if (datosPais.length === 0) {
            setError('No hay datos para este país.');
            setPorcentajeRenovable(null);
            setConsumoRenovable(null);
            return;
        }
        // Tomar el dato más reciente (mayor año)
        const filaReciente = datosPais.reduce((a, b) => (Number(a.Year) > Number(b.Year) ? a : b));
        const porcentaje = Number(filaReciente["Renewables (% equivalent primary energy)"]);
        if (!porcentaje || isNaN(porcentaje)) {
            setError('No hay datos de porcentaje renovable para este país.');
            setPorcentajeRenovable(null);
            setConsumoRenovable(null);
            return;
        }
        setPorcentajeRenovable(porcentaje.toFixed(2));
        const consumoRenovableEstimado = Number(consumo) * (porcentaje / 100);
        setConsumoRenovable(consumoRenovableEstimado.toFixed(2));
        setError(null);
    };

    return (
        <section id="formulario" className="card p-4 mb-4">
            <h4>Estimación de porcentaje de energía renovable en tu consumo</h4>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>País:</label>
                    <select
                        className="form-control"
                        value={pais}
                        onChange={e => setPais(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un país</option>
                        {paises.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label>Consumo eléctrico total (kWh):</label>
                    <input
                        type="number"
                        className="form-control"
                        value={consumo}
                        onChange={e => setConsumo(e.target.value)}
                        min="0"
                        required
                    />
                </div>
                <button className="btn btn-success" type="submit">Calcular</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {porcentajeRenovable !== null && (
                <div className="cuadro_estimaciones">
                    <strong>Porcentaje estimado de energía renovable en tu consumo:</strong> {porcentajeRenovable}%<br />
                    <strong>Consumo renovable estimado:</strong> {consumoRenovable} kWh
                </div>
            )}
        </section>
    );
}
