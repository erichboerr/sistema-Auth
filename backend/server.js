import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import { ensureDatabaseExists } from './config/setup.js';
import authRoutes from './routes/auth.routes.js';
import db from './models/index.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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
        if (process.env.DB_SYNC === 'true') {
            await sequelize.sync({ alter: true });
            console.log('✅ Tablas sincronizadas (DB_SYNC activo).');
        }

        // 4. Cargar datos iniciales (Solo si DB_SEED es true)
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
                    password: 'Root123', // El hook en User.js lo hasheará automáticamente
                    rolId: rootRol.id,
                    flagHabilitado: true
                });
                console.log('👤 Usuario inicial creado: Root / Root123');
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