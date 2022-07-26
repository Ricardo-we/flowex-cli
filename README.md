# flowex-cli
Is a express, sequelize and flow-express based cli, for creating projects faster and with the same architecture and easy to customize
To start a new project `flow-express-cli startproject <project-name>` this will generate a project structure like

```
|__root
    |__node_modules
    |__src
        |__apps
        |__config
            |app.js
            |db.config.js
    |index.js

root is the current directory you are into

To start an app `flow-express-cli startapp <app-name>`
    |__apps
        |__app-name
            |model.js
            |controller.js
            |router.js
```

## MODELS
How to sync tables?
First create an app then register the app if this app not http (websockets for example) you need to specify in apps
```
APPS = [
    "exampleapp",
    {name: "websocketApp", syncOnly: true}
]
```

### EXPORTING MODELS
For exporting models you always need to put it in an object like this
```
module.exports = {model1, model2}
```

## ADMIN
To use flowex-admin system you need a `AdminUser` to create one place in the root directory and run 
`npx flowex-cli create-admin <username> <password>`
For model register you can import admin instance from flow-express
`const admin = require("flow-express/admin/admin")` and call 
`await admin.registerModel(model.getTableName(), model);`
or pass a list of models like this
`await admin.registerMultipleModels(modelList)`
the result would be in your admin panel.
You can check your admin panel going to /admin, use your credentials and login.

### Created with old versions?
To use admin in old versions get out of the root directory and run the create with the name you used for creating the project, this will create all the project files that doesnt exists


### Flow express utils
Flow express is the library that has admin, models, routers, etc. utils of flowex.

- BaseRouter
    Base router is a router of express, it will automatically create (POST, PUT, GET, DELETE) methods with a controller, (BaseController) you can "register" more than one route using BaseRouter instance, router.registerRoute()
- BaseController
    Base controller is needed to use BaseRouter, to use it create a class that extends BaseContoller and create, (post, put,get, delete, getOne) methods 
- errorResponse
    errorResponse function is a easy to use error handler `errorResponse(error, res)`

- Basecontroller:
```
const { BaseController } = require("flow-express/general/BaseController");
const { errorResponse } = require("flow-express/general/base.response");

const successMessage = { message: "success" };
class AdminUsersController extends BaseController {
	constructor() {
		super();
	}

	async post(req, res) {
		try {
			res.json(successMessage);
		} catch (error) {
			console.error(error);
			errorResponse(error, res);
		}
	}

	async authenticate(req, res) {
		try {
            // You can add more methods to BaseController
			res.status(200).json("{ token }");
		} catch (error) {
			errorResponse(error, res);
		}
	}

	async get(req, res) {
		try {
			res.render("index");
		} catch (error) {
			errorResponse(error, res);
		}
	}

	async getOne(req, res) {
		try {
			res.json(successMessage);
		} catch (error) {
			errorResponse(error, res);
		}
	}

	async put(req, res) {
		try {
			
			return res.json(successMessage);
		} catch (error) {
			errorResponse(error, res);
		}
	}

	async delete_(req, res) {
		try {
			res.json(successMessage);
		} catch (error) {
			errorResponse(error, res);
		}
	}

}

module.exports = AdminUsersController;

```

- BaseRouter:
```
const AdminController = require("./controllers/admin.controller");
const AdminUserController = require("./controllers/admin-users.controller");
const {
	adminAuthMiddleware,
} = require("../../utils/middleware/auth.middleware");

const BaseRouter = require("flow-express/general/BaseRouter.js");

const controller = new AdminController();
const adminUsersController = new AdminUserController();
const router = new BaseRouter("/admin", ":model_name", controller, {
	post: adminAuthMiddleware,
	put: adminAuthMiddleware,
	delete: adminAuthMiddleware,
	getOne: adminAuthMiddleware,
});

router.registerRoute(adminUsersController, "/admin-users", { params: ":id" });
router.router.post("/admin-users/login", adminUsersController.authenticate);
module.exports = router;

```
All this base will be created with the command `startapp` it will create this structure and required folders
