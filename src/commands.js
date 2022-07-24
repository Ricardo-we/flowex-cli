#!/usr/bin/env node
const fs = require("fs");
const { execSync, spawnSync } = require("child_process");
const path = require("path");
const controllerTemplate = require("./utils/fileTemplateStrings/controller-template");
const routerTemplate = require("./utils/fileTemplateStrings/router-template");
const projectInitTemplates = require("./utils/fileTemplateStrings/initialize-project-templates");
const modelTemplate = require("./utils/fileTemplateStrings/model-template");
const decoratedLog = require("./utils/decorations/decorated-log");
const adminViewTemplate = require("./utils/fileTemplateStrings/admin/index-ejs");

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
		fs.writeFileSync(
			`${appDir}/controller.js`,
			controllerTemplate(controllerClassName),
		);
		fs.writeFileSync(
			`${appDir}/router.js`,
			routerTemplate(controllerClassName, appName),
		);
		fs.writeFileSync(
			`${appDir}/models.js`,
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
		// const srcPath = path.join(projectPath, "src");
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
		fs.mkdirSync(staticPaths.js);
		fs.mkdirSync(staticPaths.css);

		spawnSync(cmd, args, {
			shell: true,
			cwd: projectPath,
			stdio: "inherit",
		});
		execSync("npm install express sequelize flow-express sqlite3 cors", {
			cwd: projectPath,
		});
		const { appTemplate, appDbConfigTemplate, indexFileTemplate } =
			projectInitTemplates;

		this.createFile(appConfigPath, "app.js", appTemplate);
		this.createFile(appConfigPath, "db.config.js", appDbConfigTemplate);
		this.createFile(projectPath, "index.js", indexFileTemplate);
		this.createFile(staticPaths.js, "admin.js", adminViewTemplate);
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
	}
	return 0;
};

module.exports = main;
