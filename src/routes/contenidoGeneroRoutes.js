const express = require('express');
const router = express.Router();
const { sequelize } = require('../conexion/database')

/**
 * @swagger
 * /contenidoGenero:
 *   get:
 *     summary: Obtener todos los contenidos junto con sus géneros
 *     tags:
 *        - ContenidoGenero
 *     description: Endpoint para obtener una lista de todos los contenidos (películas y series) y sus géneros.
 *     responses:
 *       200:
 *         description: Lista de contenidos con sus géneros.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   titulo:
 *                     type: string
 *                     description: Título del contenido.
 *                   genre_name:
 *                     type: string
 *                     description: Nombre del género.
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Ocurrio un error.
 */

router.get('/', async (req, res) => {
  try {
    const contenidoGenero = await sequelize.query(
      `SELECT c.titulo, g.genre_name
             FROM contenido c
             JOIN contenido_genero cg ON c.id = cg.contenido_id
             JOIN genero g ON g.id = cg.genero_id`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.json(contenidoGenero);
  } catch (error) {
    console.error('Error al buscar contenido_genero:', error);
    res.status(500).json({ error: 'Ocurrio un error.' });
  }
});

/**
 * @swagger
 * /contenidoGenero/{id}:
 *   get:
 *     summary: Obtener géneros de un contenido por ID
 *     tags:
 *        - ContenidoGenero
 *     description: Endpoint para obtener los géneros asociados a un contenido específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contenido.
 *     responses:
 *       200:
 *         description: Géneros asociados al contenido.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   titulo:
 *                     type: string
 *                     description: Título del contenido.
 *                   genre_name:
 *                     type: string
 *                     description: Nombre del género.
 *       404:
 *         description: Contenido no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: Contenido_genero no encontrado.
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Ocurrio un error.
 */

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const contenidoGenero = await sequelize.query(
      `SELECT c.titulo, g.genre_name
         FROM contenido c
         JOIN contenido_genero cg ON c.id = cg.contenido_id
         JOIN genero g ON g.id = cg.genero_id
         WHERE c.id = :id`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { id: parseInt(id, 10) },
      }
    );
    if (contenidoGenero.length > 0) {
      res.json(contenidoGenero);
    } else {
      res.status(404).json({ error: 'Contenido_genero no enciontrado.' });
    }
  } catch (error) {
    console.error('Error al buscar la pelicula por id:', error);
    res.status(500).json({ error: 'Ocurrio un error.' });
  }
});

/**
 * @swagger
 * /contenidoGenero:
 *   post:
 *     summary: Añadir un género a un contenido
 *     tags:
 *        - ContenidoGenero
 *     description: Endpoint para añadir un género a un contenido específico utilizando su título y el nombre del género.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título del contenido.
 *               genre_name:
 *                 type: string
 *                 description: Nombre del género a añadir.
 *     responses:
 *       200:
 *         description: Género añadido exitosamente al contenido.
 *         content:
 *           application/json:
 *             example:
 *               message: Se agregó el género de manera exitosa.
 *       404:
 *         description: Contenido o género no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: No se encontró el contenido o el género.
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Ocurrió un error.
 */

router.post('/', async (req, res) => {
  const { titulo, genre_name } = req.body;

  try {
    const [contenido] = await sequelize.query(
      `SELECT id FROM contenido WHERE titulo = :titulo`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { titulo },
      }
    );

    if (!contenido) {
      return res.status(404).json({ error: 'No se encontro pelicula con ese titulo.' });
    }

    const [genero] = await sequelize.query(
      `SELECT id FROM genero WHERE genre_name = :genre_name`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { genre_name },
      }
    );

    if (!genero) {
      return res.status(404).json({ error: 'No se encontro genero con ese nombre.' });
    }

    await sequelize.query(
      `INSERT INTO contenido_genero (contenido_id, genero_id) VALUES (:contenidoId, :generoId)`,
      {
        type: sequelize.QueryTypes.INSERT,
        replacements: {
          contenidoId: contenido.id,
          generoId: genero.id,
        },
      }
    );

    res.json({ message: 'Se agrego el genero de manera existosa :).' });
  } catch (error) {
    console.error('Error al añadir un nuevo genero a contenido_genero:', error);
    res.status(500).json({ error: 'Ocurrio un error :(.' });
  }
});

/**
 * @swagger
 * /contenidoGenero/actualizar/{contenidoId}:
 *   put:
 *     summary: Actualizar el género de un contenido
 *     tags:
 *        - ContenidoGenero
 *     description: Endpoint para añadir un género adicional a un contenido específico utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: contenidoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contenido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genre_name:
 *                 type: string
 *                 description: Nombre del género a añadir.
 *     responses:
 *       200:
 *         description: Género añadido exitosamente al contenido.
 *         content:
 *           application/json:
 *             example:
 *               message: El género se añadió correctamente a la película.
 *       404:
 *         description: Género no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: No se encontró el género.
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Ocurrió un error.
 */

router.put('/actualizar/:contenidoId', async (req, res) => {
  const { contenidoId } = req.params;
  const { genre_name } = req.body;

  try {
    const [genero] = await sequelize.query(
      `SELECT id FROM genero WHERE genre_name = :genre_name`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { genre_name },
      }
    );

    if (!genero) {
      return res.status(404).json({ error: 'No se encontro genero con ese nombre.' });
    }

    await sequelize.query(
      `INSERT INTO contenido_genero (contenido_id, genero_id) VALUES (:contenidoId, :generoId)`,
      {
        type: sequelize.QueryTypes.INSERT,
        replacements: {
          contenidoId: parseInt(contenidoId, 10),
          generoId: genero.id,
        },
      }
    );

    res.json({ message: 'El genero se añadio correctamente a la peliucla.' });
  } catch (error) {
    console.error('Error al añadir el genero en contenido_genero:', error);
    res.status(500).json({ error: 'Ocurrio un error :(.' });
  }
});

/**
 * @swagger
 * /contenidoGenero/{contenidoId}:
 *   delete:
 *     summary: Eliminar los géneros de un contenido
 *     tags:
 *        - ContenidoGenero
 *     description: Endpoint para eliminar todos los géneros asociados a un contenido específico por su ID.
 *     parameters:
 *       - in: path
 *         name: contenidoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contenido.
 *     responses:
 *       200:
 *         description: Géneros eliminados exitosamente del contenido.
 *         content:
 *           application/json:
 *             example:
 *               message: Dato eliminado correctamente de contenido_genero.
 *       404:
 *         description: Contenido no encontrado en contenido_genero.
 *         content:
 *           application/json:
 *             example:
 *               error: No se encontró el dato en contenido_genero.
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Ocurrió un error.
 */

router.delete('/:contenidoId', async (req, res) => {
  const { contenidoId } = req.params;

  try {
    const [existingEntry] = await sequelize.query(
      `SELECT * FROM contenido_genero WHERE contenido_id = :contenidoId`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { contenidoId: parseInt(contenidoId, 10) },
      }
    );

    if (!existingEntry) {
      return res.status(404).json({ error: 'No se encontro el dato en contenido_genero.' });
    }

    await sequelize.query(
      `DELETE FROM contenido_genero
         WHERE contenido_id = :contenidoId`,
      {
        type: sequelize.QueryTypes.DELETE,
        replacements: { contenidoId: parseInt(contenidoId, 10) },
      }
    );

    res.json({ message: 'Dato eliminado correctamente de contenido_genero.' });
  } catch (error) {
    console.error('Error al eliminar el dato de contenido_genero:', error);
    res.status(500).json({ error: 'Ocurrio un error :( .' });
  }
});


module.exports = router;