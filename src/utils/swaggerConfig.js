const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Trailerflix API de Actores y Películas',
            version: '1.0.0',
            description: 'Documentación generada con Swagger para la API Trailerflix de Actores y Películas',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        tags: [
            { name: 'Actor', description: 'Rutas relacionadas con los actores' },
            { name: 'Genero', description: 'Rutas relacionadas con los géneros' },
            { name: 'Contenido', description: 'Rutas relacionadas con los contenido(película o serie)' },
            { name: 'ContenidoActor', description: 'Rutas relacionadas con contenido y actores' },
            { name: 'ContenidoGenero', description: 'Rutas relacionados con contenido y géneros' },
        ],
        components: {
            schemas: {
                Actor: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único del actor',
                            example: 1,
                        },
                        first_name: {
                            type: 'string',
                            description: 'Nombre del actor',
                            example: 'John',
                        },
                        last_name: {
                            type: 'string',
                            description: 'Apellido del actor',
                            example: 'Doe',
                        },
                    },
                    required: ['first_name', 'last_name'],
                },
                Genero: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único del genero',
                            example: 1,
                        },
                        genre_name: {
                            type: 'string',
                            description: 'Nombre del genero',
                            example: 'Misterio',
                        },
                    },
                    required: ['genre_name'],
                },
                Contenido: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único del contenido/película/serie',
                            example: 1,
                        },
                        poster: {
                            type: 'string',
                            description: 'URL del póster del contenido/película/serie',
                            example: 'https://example.com/poster.jpg',
                        },
                        categoria: {
                            type: 'string',
                            description: 'Categoría del contenido/película/serie, ya sea "Serie" o "Película"',
                            enum: ['Serie', 'Película'],
                            example: 'Serie',
                        },
                        titulo: {
                            type: 'string',
                            description: 'Título del contenido/película/serie',
                            example: 'Breaking Bad',
                        },
                        resumen: {
                            type: 'string',
                            description: 'Resumen o descripción del contenido',
                            example: 'Un profesor de química se convierte en fabricante de drogas.',
                        },
                        temporadas: {
                            type: 'string',
                            description: 'Número de temporadas (si es una serie) o duración (si es una película)',
                            example: '5',
                        },
                        trailer: {
                            type: 'string',
                            description: 'URL del trailer del contenido/película/serie',
                            example: 'https://example.com/trailer.mp4',
                        },
                    },
                    required: ['poster', 'categoria', 'titulo', 'trailer'],
                },
                ContenidoActor: {
                    type: 'object',
                    properties: {
                        contenido_id: {
                            type: 'integer',
                            description: 'ID de la película/contenido',
                            example: 1,
                        },
                        actor_id: {
                            type: 'integer',
                            description: 'ID del actor',
                            example: 1,
                        },
                    },
                    required: ['contenido_id', 'actor_id'],
                },
                ContenidoGenero: {
                    type: 'object',
                    properties: {
                        contenido_id: {
                            type: 'integer',
                            description: 'ID de la película/contenido',
                            example: 1,
                        },
                        genero_id: {
                            type: 'integer',
                            description: 'ID del genero',
                            example: 1,
                        },
                    },
                    required: ['contenido_id', 'genero_id'],
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)

module.exports = { swaggerDocs, swaggerUi }