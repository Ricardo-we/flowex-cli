const appTemplate = `
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const adminRouter = require("flow-express/admin/router");

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "..", "public", "static")));
app.set("views", path.join(__dirname, "../public", "templates"));

// ADMIN
// FOR CUSTOM TOKEN KEY USE .env, API_SECRET_KEY
app.use(adminRouter.router);

const APPS = [
	//Include your apps with name
];

for (const appData of APPS) {
	if (typeof appData === "string") {
		const router = require(\`../apps/\${appData}/router.js\`);
		app.use(router.getRouter());
	}
}

module.exports = {
	app,
	APPS,
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
        await model.sync({alter, force})
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
const adminModels = require("flow-express/admin/models");
const admin = require("flow-express/admin/admin");

app.listen(APP_PORT, async () => {
	const reset = false;
	try {
		const models = getAppsModels(APPS, "./src/apps/");
		await authenticate();

		await admin.registerMultipleModels([
			...models,
			...Object.values(adminModels),
		]);

		await syncTables(Object.values(adminModels), reset, false);
		await syncTables(models, reset, false);
		console.log("Listening on port " + APP_PORT);
	} catch (error) {
		console.error(error);
	}
});

`;

module.exports = {
	indexFileTemplate,
	appDbConfigTemplate,
	appTemplate,
};
