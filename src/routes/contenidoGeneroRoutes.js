const express = require('express');
const router = express.Router();
const { sequelize } = require('../conexion/database')

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