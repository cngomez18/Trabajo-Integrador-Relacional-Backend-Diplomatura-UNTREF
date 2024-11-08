const express = require('express');
const { Genero } = require('../models/genero');
const router = express.Router();

/**
 * @swagger
 * /genero:
 *   get:
 *     summary: Obtener todos los géneros
 *     tags:
 *        - Genero
 *     description: Endpoint para obtener una lista de todos los géneros en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de géneros obtenida exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 genre_name: Acción
 *               - id: 2
 *                 genre_name: Comedia
 *       404:
 *         description: No se encontraron géneros.
 *         content:
 *           application/json:
 *             example:
 *               error: No se encontraron géneros
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Error al obtener géneros
 */

router.get('/', async (req, res) => {
  try {
    const genres = await Genero.findAll();
    if (genres.length > 0) {
      res.status(200).json(genres);
    } else {
      res.status(404).json({ error: 'No se encontraron géneros' });
    }
  } catch (error) {
    console.error("Error al obtener géneros:", error);
    res.status(500).json({ error: 'Error al obtener géneros' });
  }
});

/**
 * @swagger
 * /genero/{id}:
 *   get:
 *     summary: Obtener un género por ID
 *     tags:
 *        - Genero
 *     description: Endpoint para obtener un género específico usando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del género a obtener
 *     responses:
 *       200:
 *         description: Género encontrado.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               genre_name: Acción
 *       404:
 *         description: Género no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: Género no encontrado
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Error al obtener género
 */

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const genre = await Genero.findByPk(id);
    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(404).json({ error: 'Género no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener género por ID:", error);
    res.status(500).json({ error: 'Error al obtener género' });
  }
});

/**
 * @swagger
 * /genero:
 *   post:
 *     summary: Crear un nuevo género
 *     tags:
 *        - Genero 
 *     description: Endpoint para crear un género en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genre_name:
 *                 type: string
 *                 description: Nombre del género
 *                 example: Ciencia Ficción
 *     responses:
 *       201:
 *         description: Género creado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               genre_name: Ciencia Ficción
 *       400:
 *         description: Datos faltantes o inválidos.
 *         content:
 *           application/json:
 *             example:
 *               error: El nombre del genero es obligatorio
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Error al crear el genero
 */

router.post('/', async (req, res) => {
  const { genre_name } = req.body;
  if (!genre_name) {
    return res.status(400).json({ error: 'El nombre del genero es obligatorio' });
  }

  try {
    const newGenre = await Genero.create({ genre_name });
    res.status(201).json(newGenre);
  } catch (error) {
    console.error("Error al crear genero:", error);
    res.status(500).json({ error: 'Error al crear el genero' });
  }
});

/**
 * @swagger
 * /genero/{id}:
 *   put:
 *     summary: Actualizar un género existente
 *     tags:
 *        - Genero 
 *     description: Endpoint para actualizar un género específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del género a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genre_name:
 *                 type: string
 *                 description: Nombre actualizado del género
 *                 example: Drama
 *     responses:
 *       200:
 *         description: Género actualizado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               genre_name: Drama
 *       400:
 *         description: Datos faltantes o inválidos.
 *         content:
 *           application/json:
 *             example:
 *               error: El nombre del genero es obligatorio
 *       404:
 *         description: Género no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: No se pudo encontrar el genero
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Error al actualizar el genero
 */

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { genre_name } = req.body;
  if (!genre_name) {
    return res.status(400).json({ error: 'El nombre del genero es obligatorio' });
  }

  try {
    const genre = await Genero.findByPk(id);
    if (genre) {
      genre.genre_name = genre_name;
      await genre.save();
      res.status(200).json(genre);
    } else {
      res.status(404).json({ error: 'No se pudo encontrar el genero' });
    }
  } catch (error) {
    console.error("Error al actualizar el genero:", error);
    res.status(500).json({ error: 'Error al actualizar el genero' });
  }
});

/**
 * @swagger
 * /genero/{id}:
 *   delete:
 *     summary: Eliminar un género
 *     tags:
 *        - Genero
 *     description: Endpoint para eliminar un género específico usando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del género a eliminar
 *     responses:
 *       204:
 *         description: Género eliminado exitosamente (sin contenido).
 *       404:
 *         description: Género no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: No se pudo encontrar el genero
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Error al eliminar el genero
 */

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const genre = await Genero.findByPk(id);
    if (genre) {
      await genre.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'No se pudo encontrar el genero' });
    }
  } catch (error) {
    console.error("Error al eliminar el genero:", error);
    res.status(500).json({ error: 'Error al eliminar el genero' });
  }
});

module.exports = router;
