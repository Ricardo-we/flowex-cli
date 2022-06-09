module.exports = (controllerClassName) => `
const { BaseController } = require("flow-express/general/BaseController");
const { errorResponse } = require("flow-express/general/base.response");

const successMessage = {message: "success"};
class ${controllerClassName}Controller extends BaseController {
    constructor() {
        super();
    }

    async post(req, res) {
        try {
            res.json(successMessage);
        } catch (error) {
            errorResponse(error, res);
        }
    }

    async get(req, res) {
        try {
            res.status(200).json(successMessage);
        } catch (error) {
            errorResponse(error, res);
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            res.json(successMessage);
        } catch (error) {
            errorResponse(error, res);
        }
    }

    async put(req, res) {
        try {
            const { id } = req.params;
            res.json(successMessage);
        } catch (error) {
            errorResponse(error, res);
        }
    }

    async delete_(req, res) {
        try {
            const { id } = req.params;
            res.json(successMessage);
        } catch (error) {
            errorResponse(error, res);
        }
    }
}

module.exports = ${controllerClassName}Controller;
`;
