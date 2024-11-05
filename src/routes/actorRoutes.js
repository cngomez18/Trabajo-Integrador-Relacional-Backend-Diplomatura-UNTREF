/**
 * @swagger
 * tags:
 *   name: Actor
 *   description: Rutas relacionadas con los actores
 */

const express = require('express');
const router = express.Router();
const { Actor } = require('../models/actor');

/**
 * @swagger
 * /actor:
 *   get:
 *     summary: Obtener todos los actores
 *     tags:
 *        - Actor
 *     description: Endpoint para obtener una lista de todos los actores en la base de datos.
 *     responses:
 *       200:
 *         description: Respuesta exitosa. Devuelve una lista de actores.
 *         content:
 *           application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Actor'
 *       404:
 *         description: No se encontraron actores para listar.
 *         content:
 *           application/json:
 *             example:
 *               error: No se encontraron actores para listar.
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Error en el servidor
 */

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

/**
 * @swagger
 * /actor/{id}:
 *   get:
 *     summary: Obtener un actor por ID
 *     tags:
 *        - Actor
 *     description: Endpoint para obtener los detalles de un actor específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del actor
 *     responses:
 *       200:
 *         description: Actor encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       404:
 *         description: No se encontró el actor.
 *         content:
 *           application/json:
 *             example:
 *               error: No se encontró el actor
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Error en el servidor
 */

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

/**
 * @swagger
 * /actor:
 *   post:
 *     summary: Crear un nuevo actor
 *     tags:
 *        - Actor
 *     description: Endpoint para crear un nuevo actor en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Actor creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       400:
 *         description: Nombre y apellido son obligatorios.
 *       500:
 *         description: Error al crear el actor.
 */

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

/**
 * @swagger
 * /actor/{id}:
 *   put:
 *     summary: Actualizar un actor
 *     tags:
 *        - Actor
 *     description: Endpoint para actualizar los datos de un actor existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del actor a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Actor actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       400:
 *         description: Nombre y apellido son obligatorios.
 *       404:
 *         description: No se encontró el actor para actualizar.
 *       500:
 *         description: Error al actualizar el actor.
 */

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

/**
 * @swagger
 * /actor/{id}:
 *   delete:
 *     summary: Eliminar un actor
 *     tags:
 *        - Actor
 *     description: Endpoint para eliminar un actor de la base de datos por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del actor a eliminar
 *     responses:
 *       204:
 *         description: Actor eliminado exitosamente.
 *       404:
 *         description: No se encontró el actor para eliminar.
 *       500:
 *         description: Error al eliminar el actor.
 */

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
