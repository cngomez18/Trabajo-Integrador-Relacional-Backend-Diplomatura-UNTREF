/**
 * @swagger
 * tags:
 *   name: Contenido
 *   description: Rutas relacionadas con contenido(películas y series)
 */

const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Contenido } = require('../models/contenido');


/**
 * @swagger
 * /contenido:
 *   get:
 *     summary: Obtener todos los contenidos(películas y series)
 *     tags:
 *        - Contenido
 *     description: Endpoint para obtener una lista de todos los contenidos(películas y series) en la base de datos.
 *     responses:
 *       200:
 *         description: Respuesta exitosa. Devuelve una lista de contenidos(películas y series).
 *         content:
 *           application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Contenido'
 *       404:
 *         description: No se encontro contenido para listar.
 *         content:
 *           application/json:
 *             example:
 *               error: No se encontro contenido para listar.
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Error en el servidor
 */

router.get('/', async (req, res) => {
  try {
    const contents = await Contenido.findAll();

    if (contents.length > 0) {
      res.status(200).json(contents);
    } else {
      res.status(404).json({ error: 'No se encontraron peliculas' });
    }
  } catch (error) {
    console.error("Error al obtener peliculas:", error);
    res.status(500).json({ error: 'Error al obtener peliculas' });
  }
});

/**
 * @swagger
 * /contenido/filtrar:
 *   get:
 *     summary: Filtrar contenidos por título y categoría
 *     tags:
 *        - Contenido    
 * description: Endpoint para filtrar contenidos (películas o series) según título y/o categoría.
 *     parameters:
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         description: Título parcial o completo de la película o serie a buscar.
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Categoría del contenido a buscar (por ejemplo, "Serie" o "Película").
 *     responses:
 *       200:
 *         description: Lista de contenidos que coinciden con los filtros aplicados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contenido'
 *       404:
 *         description: No se encontraron contenidos que coincidan con los filtros.
 *         content:
 *           application/json:
 *             example:
 *               error: No se encontraron películas que coincidan con los filtros.
 *       500:
 *         description: Error en el servidor al intentar filtrar los contenidos.
 *         content:
 *           application/json:
 *             example:
 *               error: Error al filtrar películas
 */

router.get('/filtrar', async (req, res) => {
  const { titulo, categoria } = req.query;

  const conditions = {};

  if (titulo) {
    conditions.titulo = { [Op.like]: `%${titulo}%` };
  }

  if (categoria) {
    conditions.categoria = categoria;
  }

  try {
    const contenidos = await Contenido.findAll({
      where: conditions
    });

    if (contenidos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron peliculas que coincidan con los filtros' });
    }

    res.status(200).json(contenidos);
  } catch (error) {
    console.error('Error al filtrar peliculas:', error);
    res.status(500).json({ error: 'Error al filtrar peliculas' });
  }
});

/**
 * @swagger
 * /contenido{id}:
 *   get:
 *     summary: Obtener un contenido(película o serie) por ID
 *     tags:
 *        - Contenido
 *     description: Endpoint para obtener los detalles de un contenido(película o serie) por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contenido
 *     responses:
 *       200:
 *         description: Contenido(película o serie) encontrado.
 *         content:
 *           application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Contenido'
 *       404:
 *         description: No se encontro el contenido(película o serie).
 *         content:
 *           application/json:
 *             example:
 *               error: No se encontro el contenido(película o serie).
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Error en el servidor
 */

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const content = await Contenido.findByPk(id);
    if (content) {
      res.status(200).json(content);
    } else {
      res.status(404).json({ error: 'Pelicula no encontrada' });
    }
  } catch (error) {
    console.error("Error al bsucar la peliucla por ID:", error);
    res.status(500).json({ error: 'Error al buscar las peliculas' });
  }
});

/**
 * @swagger
 * /contenido:
 *   post:
 *     summary: Crear un nuevo contenido (película o serie)
 *     tags:
 *        - Contenido 
 *     description: Endpoint para crear un nuevo contenido en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               poster:
 *                 type: string
 *                 description: URL del poster de la película o serie.
 *               titulo:
 *                 type: string
 *                 description: Título de la película o serie.
 *               resumen:
 *                 type: string
 *                 description: Resumen o sinopsis del contenido.
 *               temporadas:
 *                 type: integer
 *                 description: Número de temporadas (para series).
 *               trailer:
 *                 type: string
 *                 description: URL del trailer de la película o serie.
 *               categoria:
 *                 type: string
 *                 description: Categoría del contenido (por ejemplo, "Serie" o "Película").
 *     responses:
 *       201:
 *         description: Contenido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contenido'
 *       400:
 *         description: Datos incompletos o incorrectos en el cuerpo de la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: Poster, título, trailer y categoría son obligatorios.
 *       500:
 *         description: Error en el servidor al intentar crear el contenido.
 *         content:
 *           application/json:
 *             example:
 *               error: Error al crear la película
 */

router.post('/', async (req, res) => {
  const { poster, titulo, resumen, temporadas, trailer, categoria } = req.body;
  if (!poster || !titulo || !trailer || !categoria) {
    return res.status(400).json({ error: 'Poster, titulo, trailer y categoria son obligatorios !' });
  }

  try {
    const newContent = await Contenido.create({
      poster,
      titulo,
      resumen,
      temporadas,
      trailer,
      categoria,
    });
    res.status(201).json(newContent);
  } catch (error) {
    console.error("Error al crear la pelicula: ", error);
    res.status(500).json({ error: 'Error al crear la pelicula ' });
  }
});

/**
 * @swagger
 * /contenido/{id}:
 *   put:
 *     summary: Actualizar un contenido existente por ID
 *     tags:
 *        - Contenido 
 *     description: Endpoint para actualizar los detalles de un contenido (película o serie) en la base de datos.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contenido a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               poster:
 *                 type: string
 *                 description: URL del poster de la película o serie.
 *               titulo:
 *                 type: string
 *                 description: Título de la película o serie.
 *               resumen:
 *                 type: string
 *                 description: Resumen o sinopsis del contenido.
 *               temporadas:
 *                 type: integer
 *                 description: Número de temporadas (para series).
 *               trailer:
 *                 type: string
 *                 description: URL del trailer de la película o serie.
 *               categoria:
 *                 type: string
 *                 description: Categoría del contenido (por ejemplo, "Serie" o "Película").
 *     responses:
 *       200:
 *         description: Contenido actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contenido'
 *       400:
 *         description: Datos incompletos o incorrectos en el cuerpo de la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: Poster, título, trailer y categoría son obligatorios.
 *       404:
 *         description: Contenido no encontrado para actualizar.
 *         content:
 *           application/json:
 *             example:
 *               error: Película no encontrada.
 *       500:
 *         description: Error en el servidor al intentar actualizar el contenido.
 *         content:
 *           application/json:
 *             example:
 *               error: Error al actualizar la película
 */

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { poster, titulo, resumen, temporadas, trailer, categoria } = req.body;
  if (!poster || !titulo || !trailer || !categoria) {
    return res.status(400).json({ error: 'Poster, titulo, trailer y categoria son obligatorios !' });
  }

  try {
    const content = await Contenido.findByPk(id);
    if (content) {
      content.poster = poster;
      content.titulo = titulo;
      content.resumen = resumen;
      content.temporadas = temporadas;
      content.trailer = trailer;
      content.categoria = categoria;
      await content.save();
      res.status(200).json(content);
    } else {
      res.status(404).json({ error: 'Pelicula no encontrada' });
    }
  } catch (error) {
    console.error("Error al actualizar la pelicula:", error);
    res.status(500).json({ error: 'Error al actualizar la pelicula' });
  }
});

/**
 * @swagger
 * /contenido/{id}:
 *   delete:
 *     summary: Eliminar un contenido(película o serie)
 *     tags:
 *        - Contenido 
 *     description: Endpoint para eliminar un contenido(película o serie) de la base de datos por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contenido a eliminar
 *     responses:
 *       204:
 *         description: Contenido(película o serie) eliminado exitosamente.
 *       404:
 *         description: No se encontró el contenido(película o serie) para eliminar.
 *       500:
 *         description: Error al eliminar el contenido(película o serie).
 */

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const content = await Contenido.findByPk(id);
    if (content) {
      await content.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Pelicula no encontrada' });
    }
  } catch (error) {
    console.error("Error al eliminar la pelicula:", error);
    res.status(500).json({ error: 'Error al eliminar la pelicula' });
  }
});


module.exports = router;
