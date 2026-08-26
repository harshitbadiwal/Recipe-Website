const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const config = require('./config/env.config');
const routes = require('./routes');
const swaggerSpec = require('./docs/swagger');
const errorHandler = require('./middlewares/error.middleware');
const notFoundHandler = require('./middlewares/notFound.middleware');
const requestLogger = require('./middlewares/logger.middleware');
const { apiLimiter } = require('./middlewares/rateLimiter.middleware');

const app = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cross-Origin Resource Sharing (Allow all origins)
app.use(cors());

// Logging Middleware
app.use(requestLogger);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Rate Limiter
app.use('/api', apiLimiter);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Recipe Master API Docs',
}));

// API v1 Routes
app.use('/api/v1', routes);

// Base Route Health Check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Recipe Master REST API Server Running',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

// 404 Route Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
