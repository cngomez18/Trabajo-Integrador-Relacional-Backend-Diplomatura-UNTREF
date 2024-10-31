const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Contenido } = require('../models/contenido');

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
