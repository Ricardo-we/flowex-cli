module.exports = (controllerName, appName) => `
const ${controllerName}Controller = require("./controller");
const BaseRouter = require("flow-express/general/BaseRouter.js");

const controller = new ${controllerName}Controller();
const router = new BaseRouter("/${appName.toLowerCase()}", ":id", controller);

module.exports = router;
`;
