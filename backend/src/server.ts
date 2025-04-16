import app from './app';
import env from './config/environment';
import logger from './utils/logger';
import { connectDB, disconnectDB } from './config/database';

const PORT = env.PORT;

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Iniciar el servidor
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
      logger.info(`API Documentation available at http://localhost:${PORT}/api`);
    });
    
    // Manejo de señales de terminación
    const gracefulShutdown = async () => {
      logger.info('Shutting down gracefully...');
      
      server.close(async () => {
        logger.info('Server closed');
        
        // Desconectar de la base de datos
        await disconnectDB();
        
        process.exit(0);
      });
      
      // Si no se cierra en 10 segundos, forzar cierre
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };
    
    // Escuchar señales de terminación
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

// Iniciar el servidor
startServer();