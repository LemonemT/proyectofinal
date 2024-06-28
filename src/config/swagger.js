import swaggerAutogen from 'swagger-autogen'

const doc = {

  info: {
    title: 'Proyecto Final Plataforma-Interactiva',
    description: 'Plataforma Interactiva para gestion de Blogs'

  },
  host: 'localhost:3000'
}

const outputFile = './swagger-output.json'
const routes = ['./src/index.js']

swaggerAutogen()(outputFile, routes, doc)
