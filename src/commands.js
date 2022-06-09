#!/usr/bin/env node
const fs = require("fs");
const { execSync, spawnSync } = require("child_process");
const path = require("path");
const controllerTemplate = require("./utils/fileTemplateStrings/controller-template");
const routerTemplate = require("./utils/fileTemplateStrings/router-template");
const projectInitTemplates = require("./utils/fileTemplateStrings/initialize-project-templates");
const modelTemplate = require("./utils/fileTemplateStrings/model-template");
const decoratedLog = require("./utils/decorations/decorated-log");

class Commands {
	constructor(baseDir = __dirname) {
		this.baseDir = baseDir;
	}

	startApp(appName) {
		decoratedLog("Flowex cli", "starting new app " + appName);
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
			`${appDir}/model.js`,
			modelTemplate(controllerClassName),
		);
	}

	startProject(projectName) {
		decoratedLog("Flowex cli", "starting project " + projectName);
		const cmd = process.platform === "win32" ? "cmd" : "npm";
		const args =
			process.platform === "win32" ? ["/c", "npm init"] : ["init"];
		const projectPath = path.join(this.baseDir, projectName);
		const srcPath = path.join(projectPath, "src");
		const appsPath = path.join(srcPath, "apps");
		const appConfigPath = path.join(srcPath, "config");
		fs.mkdirSync(projectPath);
		fs.mkdirSync(srcPath);
		fs.mkdirSync(appsPath);
		fs.mkdirSync(appConfigPath);
		spawnSync(cmd, args, {
			shell: true,
			cwd: projectPath,
			stdio: "inherit",
		});
		execSync("npm install express sequelize flow-express", {
			cwd: projectPath,
		});
		fs.writeFileSync(
			path.join(appConfigPath, "app.js"),
			projectInitTemplates.appTemplate,
		);
		fs.writeFileSync(
			path.join(appConfigPath, "db.config.js"),
			projectInitTemplates.appDbConfigTemplate,
		);
		fs.writeFileSync(
			path.join(projectPath, "index.js"),
			projectInitTemplates.indexFileTemplate,
		);
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
