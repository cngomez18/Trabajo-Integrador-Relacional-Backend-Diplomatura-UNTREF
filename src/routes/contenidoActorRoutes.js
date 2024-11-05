const express = require('express');
const router = express.Router();
const { sequelize } = require('../conexion/database')


router.get('/', async (req, res) => {
    try {
        const results = await sequelize.query(
            `SELECT c.titulo, a.first_name, a.last_name
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
            return res.status(404).json({ error: 'Actor not found.' });
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
            return res.status(404).json({ error: 'Actor not found.' });
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