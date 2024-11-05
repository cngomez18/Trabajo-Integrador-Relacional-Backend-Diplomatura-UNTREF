const express = require('express');
const { sequelize } = require('./conexion/database.js');   
const { swaggerUi, swaggerDocs } = require('./utils/swaggerConfig')

const contenidoRoutes = require('./routes/contenidoRoutes.js');
const contenidoGeneroRoutes = require('./routes/contenidoGeneroRoutes.js');
const contenidoActorRoutes = require('./routes/contenidoActorRoutes.js')
const actorRoutes = require('./routes/actorRoutes.js');
const generoRoutes = require('./routes/generoRoutes.js');        


const PORT = process.env.PORT || 3000;
const app = express();


app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use('/actor', actorRoutes)
app.use('/genero', generoRoutes)
app.use('/contenido', contenidoRoutes)
app.use('/contenidoGenero', contenidoGeneroRoutes)
app.use('/contenidoActor', contenidoActorRoutes)


console.log('estoy funcando')

async function appStart() {
    try {
        await sequelize.authenticate();

        console.log('conexion exitosa a la base de datos ');

        await sequelize.sync({ force: false }); 
        
        console.log('tablas sincronizadas :)');

    } catch (error) {
        console.error('error conectando a la base de datos:', error);
    }
}

appStart();


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});