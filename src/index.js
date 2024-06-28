import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import { PORT } from './config/config.js'
import swaggerOutput from './config/swagger-output.json' assert { type: 'json' }

import usuariosRoutes from './routes/usuarios.routes.js'
import roleRoutes from './routes/roles.routes.js'
import publicacionRoutes from './routes/publicaciones.routes.js'
import categoriaRoutes from './routes/categorias.routes.js'
import comentarioRoutes from './routes/comentarios.routes.js'

dotenv.config()

const app = express()

// Middlewares
app.use(morgan('dev'))
app.use(express.json())

// Rutas
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/publicaciones', publicacionRoutes)
app.use('/api/categorias', categoriaRoutes)
app.use('/api/comentarios', comentarioRoutes)

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput))

// Inicio del servidor
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))