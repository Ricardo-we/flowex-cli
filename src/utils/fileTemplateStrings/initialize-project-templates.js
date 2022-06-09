const appTemplate = `
const express = require("express");
const app = express();

app.use(express.json());

const APPS = [
   //Include your apps with name 
]

for(const appName of APPS){
    const router = require(\`../apps/\${appName}/router.js\`);
    app.use(router.getRouter())
}

module.exports = {
    app,
    APPS
};
`;

const appDbConfigTemplate = `
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
});

const authenticate = async () => {
    await sequelize.authenticate()
}

const syncTables = async (models=[], alter=false, force=false) => {
    for(const model of models){
        model.sync({alter, force})
    }
}

module.exports = {
    sequelize,
    authenticate,
    syncTables
};
`;

const indexFileTemplate = `
const APP_PORT = process.env.PORT || 5005;
const { app, APPS } = require("./src/config/app");
const { syncTables, authenticate } = require("./src/config/db.config");

app.listen(APP_PORT, () => {
    try{
        const models = APPS.map(app => require(\`./src/apps/\${app}/models.js\`));
        authenticate();
        syncTables(models);
        console.log("Listening on port " + APP_PORT)
    } catch(error){
        console.error(error)
    }
});
`;

module.exports = {
	indexFileTemplate,
	appDbConfigTemplate,
	appTemplate,
};
