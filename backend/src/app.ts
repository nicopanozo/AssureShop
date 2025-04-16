import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './api/routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import logger from './utils/logger';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddlewares(): void {
    // Middleware de seguridad
    this.app.use(helmet());
    
    // Middleware CORS
    this.app.use(cors());
    
    // Middleware para parsear JSON
    this.app.use(express.json());
    
    // Middleware para parsear URL-encoded bodies
    this.app.use(express.urlencoded({ extended: true }));
    
    // Middleware para logging de HTTP requests
    this.app.use(morgan('dev', {
      stream: {
        write: (message: string) => logger.http(message.trim())
      }
    }));
  }

  private configureRoutes(): void {
    // Ruta principal
    this.app.get('/', (req, res) => {
      res.json({ message: 'Bienvenido a la API de Assure Shop' });
    });
    
    // Rutas de la API
    this.app.use('/api', apiRoutes);
  }

  private configureErrorHandling(): void {
    // Middleware para rutas no encontradas
    this.app.use(notFoundHandler);
    
    // Middleware de manejo de errores
    this.app.use(errorHandler);
  }
}

export default new App().app;