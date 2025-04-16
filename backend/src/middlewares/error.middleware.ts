import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Interfaz para errores personalizados
export interface AppError extends Error {
  statusCode?: number;
  errors?: any[];
}

// Middleware de manejo de errores
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  
  // Registra el error
  logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  // Respuesta de error basada en el entorno
  if (process.env.NODE_ENV === 'production') {
    // En producción, no devolver detalles del error interno
    if (statusCode === 500) {
      return res.status(statusCode).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
    
    // Para otros códigos de error, devolver el mensaje
    return res.status(statusCode).json({
      status: 'error',
      message: err.message,
      errors: err.errors
    });
  } else {
    // En desarrollo, devolver detalles completos
    return res.status(statusCode).json({
      status: 'error',
      message: err.message,
      errors: err.errors,
      stack: err.stack
    });
  }
};

// Middleware para rutas no encontradas
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error: AppError = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};