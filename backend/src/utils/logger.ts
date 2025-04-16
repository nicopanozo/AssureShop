import winston from 'winston';
import env from '../config/environment';

// Define los niveles de log y colores
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define los colores para cada nivel
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Añade los colores a winston
winston.addColors(colors);

// Define el formato del log
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

// Define los transportes para los logs
const transports = [
  // Consola
  new winston.transports.Console(),
  // Archivo para todos los logs
  new winston.transports.File({
    filename: 'logs/all.log',
  }),
  // Archivo solo para errores
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
];

// Crea la instancia del logger
const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  levels,
  format,
  transports,
});

export default logger;