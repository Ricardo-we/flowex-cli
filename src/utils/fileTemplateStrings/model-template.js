const sequelizeModelTemplate = (appName) => `
const { DataTypes } = require("sequelize");
const { IDField } = require("flow-express/db/base-fields");
const { sequelize } = require("../../config/db.config");

const ${appName}Model = sequelize.define("${appName.toLowerCase()}", {
	id: IDField,
    // Define your model
});

module.exports =  ${appName}Model;
`;

module.exports = sequelizeModelTemplate;
