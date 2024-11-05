const express = require('express');
const router = express.Router();
const { sequelize } = require('../conexion/database')


/**
 * @swagger
 * /contenidoActor:
 *   get:
 *     summary: Endpoint para obtener todos los actores de cada contenido(película o serie) 
 *     tags:
 *       - ContenidoActor
 *     description: Retorna una lista de todos los actores asociados con cada contenido(película o serie) en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de contenidos(películas y series) y sus respectivos actores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   titulo:
 *                     type: string
 *                     description: Título del contenido
 *                   first_name:
 *                     type: string
 *                     description: Nombre del actor
 *                   last_name:
 *                     type: string
 *                     description: Apellido del actor
 *       500:
 *         description: Error interno al obtener datos de contenido_actor
 *         content:
 *           application/json:
 *             example: { "error": "Ocurrio un error buscando datos de contenido_actor." }
 */


router.get('/', async (req, res) => {
    try {
        const results = await sequelize.query(
            `SELECT c.id, c.titulo, a.first_name, a.last_name
                FROM contenido_actor ca
                JOIN contenido c ON ca.contenido_id = c.id
                JOIN actor a ON ca.actor_id = a.id`,
            { type: sequelize.QueryTypes.SELECT }
        );
        res.json(results);
    } catch (error) {
        console.error('Error al traer datos de contenido_actor:', error);
        res.status(500).json({ error: 'Ocurrio un error buscando datos de contenido_actor.' });
    }
});

/**
 * @swagger
 * /contenidoActor/{contenidoId}:
 *   get:
 *     summary: Endpoint para obtener los actores de un contenido por su ID
 *     tags:
 *       - ContenidoActor
 *     description: Retorna los actores asociados a un contenido específico mediante su ID.
 *     parameters:
 *       - in: path
 *         name: contenidoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contenido
 *     responses:
 *       200:
 *         description: Lista de actores asociados al contenido específico
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   first_name:
 *                     type: string
 *                     description: Nombre del actor
 *                   last_name:
 *                     type: string
 *                     description: Apellido del actor
 *       500:
 *         description: Error interno al obtener los actores
 *         content:
 *           application/json:
 *             example: { "error": "Ocurrio un error buscando los actores." }
 */

router.get('/:contenidoId', async (req, res) => {
    const { contenidoId } = req.params;
    try {
        const results = await sequelize.query(
            `SELECT a.first_name, a.last_name
                FROM contenido_actor ca
                JOIN actor a ON ca.actor_id = a.id
                WHERE ca.contenido_id = :contenidoId`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { contenidoId }
            }
        );
        res.json(results);
    } catch (error) {
        console.error('Error buscando los actores de la pelicula:', error);
        res.status(500).json({ error: 'Ocurrio un error buscando los actores.' });
    }
});

/**
 * @swagger
 * /contenidoActor/actualizar/{contenidoId}:
 *   put:
 *     summary: Actualizar asociación de un actor a un contenido
 *     tags:
 *       - ContenidoActor
 *     description: Endpoint para añadir y actualizar la asociación de un actor a un contenido existente en la base de datos.
 *     parameters:
 *       - in: path
 *         name: contenidoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contenido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: Nombre del actor
 *               last_name:
 *                 type: string
 *                 description: Apellido del actor
 *     responses:
 *       200:
 *         description: Asociación de actor y contenido actualizada exitosamente
 *         content:
 *           application/json:
 *             example: { "message": "Se añadio correctamente el actor a la pelicula." }
 *       404:
 *         description: Actor no encontrado
 *         content:
 *           application/json:
 *             example: { "error": "No se encontro al actor." }
 *       500:
 *         description: Error al actualizar asociación
 *         content:
 *           application/json:
 *             example: { "error": "Ocurrio un error al actualizar contenido_actor." }
 */

router.put('/actualizar/:contenidoId', async (req, res) => {
    const { contenidoId } = req.params;
    const { first_name, last_name } = req.body;

    try {
        const [actor] = await sequelize.query(
            `SELECT id FROM actor WHERE first_name = :first_name AND last_name = :last_name`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { first_name, last_name }
            }
        );

        if (!actor) {
            return res.status(404).json({ error: 'No se encontro al actor.' });
        }

        await sequelize.query(
            `INSERT INTO contenido_actor (contenido_id, actor_id) VALUES (:contenidoId, :actorId)`,
            {
                type: sequelize.QueryTypes.INSERT,
                replacements: { contenidoId, actorId: actor.id }
            }
        );

        res.json({ message: 'Se añadio correctamente el actor a la pelicula.' });
    } catch (error) {
        console.error('Error al actualizar contenido_actor:', error);
        res.status(500).json({ error: 'Ocurrio un error al actualizar contenido_actor.' });
    }
});

/**
 * @swagger
 * /contenidoActor:
 *   post:
 *     summary: Asociar un actor a un contenido
 *     tags:
 *       - ContenidoActor
 *     description: Endpoint para asociar un actor existente a un contenido en la base de datos, crea una nueva asociación en la tabla contenido_actor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título del contenido
 *               first_name:
 *                 type: string
 *                 description: Nombre del actor
 *               last_name:
 *                 type: string
 *                 description: Apellido del actor
 *     responses:
 *       200:
 *         description: Asociación agregada exitosamente
 *         content:
 *           application/json:
 *             example: { "message": "Se añadio correctamente la entrada en contenido_actor." }
 *       404:
 *         description: Contenido o actor no encontrado
 *         content:
 *           application/json:
 *             example: { "error": "No se encontro la pelicula." }
 *       500:
 *         description: Error al asociar el actor al contenido
 *         content:
 *           application/json:
 *             example: { "error": "Ocurrio un error al agregar una entrada nueva." }
 */


router.post('/', async (req, res) => {
    const { titulo, first_name, last_name } = req.body;

    try {
        const [contenido] = await sequelize.query(
            `SELECT id FROM contenido WHERE titulo = :titulo`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { titulo }
            }
        );

        if (!contenido) {
            return res.status(404).json({ error: 'No se encontro la pelicula.' });
        }

        const [actor] = await sequelize.query(
            `SELECT id FROM actor WHERE first_name = :first_name AND last_name = :last_name`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { first_name, last_name }
            }
        );

        if (!actor) {
            return res.status(404).json({ error: 'No se encontro al actor.' });
        }

        await sequelize.query(
            `INSERT INTO contenido_actor (contenido_id, actor_id) VALUES (:contenidoId, :actorId)`,
            {
                type: sequelize.QueryTypes.INSERT,
                replacements: { contenidoId: contenido.id, actorId: actor.id }
            }
        );

        res.json({ message: 'Se añadio correctamente la entrada en contenido_actor.' });
    } catch (error) {
        console.error('Error al añadir entrada en contenido_actor:', error);
        res.status(500).json({ error: 'Ocurrio un error al agregar una entrada nueva.' });
    }
});

/**
 * @swagger
 * /contenidoActor/{contenidoId}:
 *   delete:
 *     summary: Eliminar todas las asociaciones de actores a un contenido
 *     tags:
 *       - ContenidoActor   
 *     description: Endpoint para eliminar todas las asociaciones de actores para un contenido específico mediante su ID.
 *     parameters:
 *       - in: path
 *         name: contenidoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contenido
 *     responses:
 *       200:
 *         description: Asociaciones eliminadas exitosamente
 *         content:
 *           application/json:
 *             example: { "message": "Todas las entradas de esa pelicula se eliminaron correctamente." }
 *       404:
 *         description: Asociación no encontrada
 *         content:
 *           application/json:
 *             example: { "error": "No se encontro la entrada en contenido_actor." }
 *       500:
 *         description: Error al eliminar la asociación
 *         content:
 *           application/json:
 *             example: { "error": "Ocurrio un error al eliminar la entrada." }
 */

router.delete('/:contenidoId', async (req, res) => {
    const { contenidoId } = req.params;

    try {
        const [existingEntry] = await sequelize.query(
            `SELECT * FROM contenido_actor WHERE contenido_id = :contenidoId`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { contenidoId: parseInt(contenidoId, 10) },
            }
        );

        if (!existingEntry) {
            return res.status(404).json({ error: 'No se encontro la entrada en contenido_actor.' });
        }

        await sequelize.query(
            `DELETE FROM contenido_actor WHERE contenido_id = :contenidoId`,
            {
                type: sequelize.QueryTypes.DELETE,
                replacements: { contenidoId: parseInt(contenidoId, 10) },
            }
        );

        res.json({ message: 'Todas las entradas de esa peliucla se eliminaron correctamente.' });
    } catch (error) {
        console.error('Error al eliminar la entrada de contenido_actor:', error);
        res.status(500).json({ error: 'Ocurrio un error al eliminar la entrada.' });
    }
});


module.exports = router