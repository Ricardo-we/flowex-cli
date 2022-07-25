#!/usr/bin/env node
const fs = require("fs");
const { execSync, spawnSync } = require("child_process");
const path = require("path");
const controllerTemplate = require("./utils/fileTemplateStrings/controller-template");
const routerTemplate = require("./utils/fileTemplateStrings/router-template");
const projectInitTemplates = require("./utils/fileTemplateStrings/initialize-project-templates");
const modelTemplate = require("./utils/fileTemplateStrings/model-template");
const decoratedLog = require("./utils/decorations/decorated-log");
// ADMIN VIEWS
const adminViewTemplate = require("./utils/fileTemplateStrings/admin/index-ejs");
const adminLoginTemplate = require("./utils/fileTemplateStrings/admin/login-ejs");
const adminStaticJsTemplate = require("./utils/fileTemplateStrings/admin/static/admin");
const formFieldsJsTemplate = require("./utils/fileTemplateStrings/admin/static/form-fields");

// const files = ({}) => [
// 	{dirName: "",  },
// 	{dirName: "",  },
// 	{dirName: "",  },
// ]

class Commands {
	constructor(baseDir = __dirname) {
		this.baseDir = baseDir;
	}

	startApp(appName) {
		decoratedLog("Flowex cli", `New app ${appName} ready!`);
		const appDir = path.join(this.baseDir, "src", "apps", appName);
		const controllerClassName = (
			appName.charAt(0).toUpperCase() + appName.slice(1)
		).replace(/\-/g, "");

		fs.mkdirSync(appDir);
		this.createFile(
			appDir,
			"controller.js",
			controllerTemplate(controllerClassName),
		);
		this.createFile(
			appDir,
			"router.js",
			routerTemplate(controllerClassName, appName),
		);
		this.createFile(
			appDir,
			"models.js",
			modelTemplate(controllerClassName),
		);
	}

	createFile(dir, filename, content) {
		return fs.writeFileSync(path.join(dir, filename), content);
	}

	startProject(projectName) {
		decoratedLog("Flowex cli", `New project ${projectName} ready!`);
		const cmd = process.platform === "win32" ? "cmd" : "npm";
		const args =
			process.platform === "win32" ? ["/c", "npm init"] : ["init"];
		const projectPath = path.join(this.baseDir, projectName);
		const srcPath = path.join(projectPath, "src");
		const appsPath = path.join(srcPath, "apps");
		const appConfigPath = path.join(srcPath, "config");
		const publicPath = path.join(srcPath, "public");
		const staticPath = path.join(publicPath, "static");
		const staticPaths = {
			js: path.join(staticPath, "js"),
			css: path.join(staticPath, "css"),
			templates: path.join(publicPath, "templates"),
		};

		// BASECONFIG
		fs.mkdirSync(projectPath);
		fs.mkdirSync(srcPath);
		fs.mkdirSync(appsPath);
		fs.mkdirSync(appConfigPath);
		// STATIC&TEMPLATES
		fs.mkdirSync(publicPath);
		fs.mkdirSync(staticPath);
		fs.mkdirSync(staticPaths.templates);
		fs.mkdirSync(path.join(staticPaths.templates, "admin"));
		fs.mkdirSync(staticPaths.js);
		fs.mkdirSync(staticPaths.css);

		spawnSync(cmd, args, {
			shell: true,
			cwd: projectPath,
			stdio: "inherit",
		});
		execSync(
			"npm install express sequelize flow-express sqlite3 cors jsonwebtoken bcrypt dotenv",
			{
				cwd: projectPath,
			},
		);
		const { appTemplate, appDbConfigTemplate, indexFileTemplate } =
			projectInitTemplates;

		this.createFile(appConfigPath, "app.js", appTemplate);
		this.createFile(appConfigPath, "db.config.js", appDbConfigTemplate);
		this.createFile(projectPath, "index.js", indexFileTemplate);

		this.createFile(
			path.join(staticPaths.templates, "admin"),
			"index.ejs",
			adminViewTemplate,
		);
		this.createFile(
			path.join(staticPaths.templates, "admin"),
			"login.ejs",
			adminLoginTemplate,
		);
		this.createFile(staticPaths.js, "admin.js", adminStaticJsTemplate);
		this.createFile(staticPaths.js, "form-fields.js", formFieldsJsTemplate);
	}

	async createAdmin(username, password) {
		try {
			const { AdminUser } = require(path.join(
				this.baseDir,
				"node_modules",
				"flow-express",
				"admin",
				"models",
			));
			await AdminUser.create({ username, password });
			console.log("User succesfully created!");
		} catch (error) {
			console.error(error);
		}
	}
}

const main = () => {
	const commands = new Commands(process.cwd());
	switch (process.argv[2]) {
		case "startproject":
			console.log("Creating project...");
			commands.startProject(process.argv[3]);
			break;
		case "startapp":
			commands.startApp(process.argv[3]);
			break;
		case "create-admin":
			commands.createAdmin(process.argv[3], process.argv[4]);
			break;
	}
	return 0;
};

module.exports = main;
