import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import { ensureDatabaseExists } from './config/setup.js';
import authRoutes from './routes/auth.routes.js';
import db from './models/index.js';

dotenv.config();

const app = express();

// --- Seguridad: Helmet ---
// Setea automáticamente varios headers HTTP de seguridad
// (X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, etc.)
// para mitigar ataques comunes (clickjacking, sniffing de MIME, etc.)
app.use(helmet());

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

const PORT = process.env.PORT || 4000;

async function startServer() {
    try {
        // 1. Crear la base de datos si no existe
        await ensureDatabaseExists();

        // 2. Conectar Sequelize
        await sequelize.authenticate();
        console.log('✅ Conexión a PostgreSQL establecida.');

        // 3. Sincronizar tablas (Solo si DB_SYNC es true)
        // ⚠️ Pensado SOLO para desarrollo local. En cualquier ambiente
        // compartido o productivo, usar siempre migraciones (npm run migrate).
        if (process.env.DB_SYNC === 'true') {
            await sequelize.sync({ alter: true });
            console.log('✅ Tablas sincronizadas (DB_SYNC activo).');
        }

        // 4. Cargar datos iniciales (Solo si DB_SEED es true)
        // Crea los roles base y un usuario "Root" si todavía no existen.
        if (process.env.DB_SEED === 'true') {
            const { Rol, Usuario } = db;

            // Verificar si hay roles, si no, crearlos
            const rolCount = await Rol.count();
            if (rolCount === 0) {
                await Rol.bulkCreate([
                    { nombre: 'Root', descripcion: 'Administrador total' },
                    { nombre: 'Administrador', descripcion: 'Administrador limitado' }
                ]);
                console.log('🎭 Roles iniciales creados.');
            }

            // Verificar si hay usuarios, si no, crear el Root
            const userCount = await Usuario.count();
            if (userCount === 0) {
                // Buscamos el ID del rol Root que acabamos de crear
                const rootRol = await Rol.findOne({ where: { nombre: 'Root' } });

                await Usuario.create({
                    user: 'Root',
                    password: 'Root123', // El hook en Usuario.js lo hasheará automáticamente
                    rolId: rootRol.id,
                    flagHabilitado: true
                });
                console.log('👤 Usuario inicial creado: Root / Root123');
                console.log('⚠️  Cambiá esta contraseña apenas inicies sesión por primera vez.');
            }
        }

        app.listen(PORT, () => {
            console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
    }
}

startServer();