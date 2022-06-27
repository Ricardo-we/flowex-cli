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

