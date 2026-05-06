const { createLogger, format, transports } = require('winston');

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const extra = Object.keys(meta).length ? JSON.stringify(meta) : '';
  return `[${timestamp}] ${level}: ${message} ${extra}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
        logFormat
      )
    })
  ]
});


const logsEmMemoria = [];




function registrarLog(level, message, meta = {}) {
  const entrada = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };
  logsEmMemoria.push(entrada);
  if (logsEmMemoria.length > 200) logsEmMemoria.shift();
  logger[level](message, meta);
}

module.exports = {
  logger,
  registrarLog,
  logsEmMemoria,
  info:  (msg, meta) => registrarLog('info', msg, meta),
  warn:  (msg, meta) => registrarLog('warn', msg, meta),
  error: (msg, meta) => registrarLog('error', msg, meta),
};