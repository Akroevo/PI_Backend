const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SpherEdu API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
  });