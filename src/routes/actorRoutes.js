const express = require('express');
const router = express.Router();
const { Actor } = require('../models/actor');

router.get('/', async (req, res) => {
  try {
    const actors = await Actor.findAll();

    if (actors.length > 0) {
      res.status(200).json(actors);
    } else {
      res.status(404).send({ error: 'No se encontraron actores' });
    }
  } catch (error) {
    console.error("Error buscando actores:", error);
    res.status(500).send({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const actor = await Actor.findByPk(req.params.id);
    if (actor) {
      res.status(200).json(actor);
    } else {
      res.status(404).send({ error: 'No se encontro el actor' });
    }
  } catch (error) {
    console.error("Error buscando el actor por ID:", error);
    res.status(500).send({ error: 'Server error' });
  }
});


router.post('/', async (req, res) => {
  const { first_name, last_name } = req.body;
  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'Nombre y apellido son obligatorios' });
  }

  try {
    const actor = await Actor.create({ first_name, last_name });
    res.status(201).json(actor);
  } catch (error) {
    console.error("Error al crear un actor:", error);
    res.status(500).json({ error: 'Error al crear un actor' });
  }
});

router.put('/:id', async (req, res) => {
  const { first_name, last_name } = req.body;
  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'Nombre y apellido son obligatorios' });
  }

  try {
    const actor = await Actor.findByPk(req.params.id);
    if (actor) {
      actor.first_name = first_name;
      actor.last_name = last_name;
      await actor.save();
      res.status(200).json(actor);
    } else {
      res.status(404).json({ error: 'No se pudo actualizar al actor' });
    }
  } catch (error) {
    console.error("Error al actualizar al actor:", error);
    res.status(500).json({ error: 'Error al actualizar al actor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const actor = await Actor.findByPk(req.params.id);
    if (actor) {
      await actor.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'No se encontro al actor' });
    }
  } catch (error) {
    console.error("Error al eliminar el actor:", error);
    res.status(500).json({ error: 'Error al eliminar el actor' });
  }
});

module.exports = router;
