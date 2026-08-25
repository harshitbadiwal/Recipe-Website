const morgan = require('morgan');

const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms', {
  skip: () => process.env.NODE_ENV === 'test',
});

module.exports = requestLogger;
