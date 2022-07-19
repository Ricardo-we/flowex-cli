const appTemplate = `
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const APPS = [
   //Include your apps with name 
]

for (const appData of APPS) {
	if (typeof appData === "string") {
		const router = require(\`../apps/\${appData}/router.js\`);
		app.use(router.getRouter());
	}
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
const { getAppsModels } = require("flow-express/utils/model-utils");

app.listen(APP_PORT, async () => {
    try{
        const models = getAppsModels(APPS, "./src/apps/"); 
        await authenticate();
        await syncTables(models);
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
