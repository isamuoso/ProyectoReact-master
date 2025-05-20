import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css'; // <--- Importa tu CSS aquí

const root = createRoot(document.getElementById('root'));
root.render(<App />);