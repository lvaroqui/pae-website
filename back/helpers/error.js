const { ValidationError } = require('sequelize')

class ErrorHandler extends Error {
  constructor(statusCode, message, errors) {
    super()
    this.statusCode = statusCode
    this.message = message
    this.data = errors || null
  }
}

const handleError = (err, res) => {
  if (err instanceof ErrorHandler) {
    const { statusCode, message, errors } = err
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      errors
    })
  }
  else if (err instanceof ValidationError) {
    const errors = err.errors.map(e => {
      return {
        message: e.message,
        instance: e.instance
      }
    })
    res.status(400).json({
      status: 'validationError',
      statusCode: 400,
      message: 'Erreur lors de la validation.',
      errors
    })
  }
  else {
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error.'
    })
  }
}

module.exports = {
  ErrorHandler, handleError
}
