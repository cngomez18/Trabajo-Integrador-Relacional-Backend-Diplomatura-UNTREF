const express = require('express');
const { Genero } = require('../models/genero');
const router = express.Router();

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
