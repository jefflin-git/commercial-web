const swaggerAutogen = require('swagger-autogen')

const doc = {
  info: {
    version: '2.1.0',
    title: 'Go shipping REST API'
  },
  definitions: {

  }
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc)