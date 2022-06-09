#!/usr/bin/env node
const figlet = require("figlet");
const gradient = require("gradient-string");

const decoratedLog = (title = "Flowex cli", messages) => {
	figlet(title, (err, data) => {
		console.log(gradient.pastel.multiline(data));
		console.log(gradient.pastel.multiline(messages));
	});
};

module.exports = decoratedLog;
