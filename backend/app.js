import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv-flow';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

// --- Seguridad: Helmet ---
// Setea automáticamente varios headers HTTP de seguridad
// (X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, etc.)
// para mitigar ataques comunes (clickjacking, sniffing de MIME, etc.)
app.use(helmet());

// Seguridad y logging
app.use(morgan('combined'));

// --- CORS ---
// CORS_ORIGIN puede tener uno o varios orígenes separados por coma,
// por ejemplo: "http://localhost:5173,https://miapp.gob.ar"
// Si no está definido, no se permite ningún origen externo (más restrictivo).
const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // "origin" es undefined en requests sin navegador (ej: Postman, curl)
        // o same-origin. Las permitimos para no romper herramientas de testing.
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Origen no permitido por CORS: ${origin}`));
        }
    },
    credentials: true, // permite el envío de cookies/headers de auth entre dominios
}));

// Parsea el body de las requests como JSON
app.use(express.json());

// --- Rutas ---
app.use('/api/auth', authRoutes);


// Middleware de errores al final
app.use(errorHandler);

export default app;