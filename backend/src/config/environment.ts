import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

const env = {
  // Configuración del servidor
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  
  // Configuración de la base de datos
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/ecommerce',
  
  // Configuración de seguridad
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  
  // Configuración de logs
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

export default env;