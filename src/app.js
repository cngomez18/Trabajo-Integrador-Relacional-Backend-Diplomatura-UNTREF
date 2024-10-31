const express = require('express');
const { sequelize } = require('./conexion/database.js');   
const contenidoRoutes = require('./routes/contenidoRoutes.js');
const actorRoutes = require('./routes/actorRoutes.js');
const generoRoutes = require('./routes/generoRoutes.js');         

const PORT = process.env.PORT || 3000;
const app = express();


app.use(express.json());

app.use('/actor', actorRoutes)
app.use('/genero', generoRoutes)
app.use('/contenido', contenidoRoutes)

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