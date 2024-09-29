# Webapp

## Using a subpath

The base URL is taken form the `homepage` field in `package.json` ([docs][2]). The domain is stripped and only the path after the root path remains:

```
"homepage": "https://foo.bar/oh-my",   --->   basename="oh-my/"
```

## Upgrade `msw` script

As per [official docs][1], navigate to the directory where your `package.json` is and run:

```bash
npx msw init public/ --save
```

## Install/upgrade NPM dependencies

1. Upgrade NPM packages ignoring docker:

   ```shell
   cd webapp
   npm install --save foo
   ```

1. Rebuild docker image with new `package.json`

   ```shell
   make rebuild-webapp
   ```

## Build

### Compilation fails due lack of permissions to access `node_modules`

```
Starting the development server...

Failed to compile.

EACCES: permission denied, mkdir '/app/node_modules/.cache'
ERROR in EACCES: permission denied, mkdir '/app/node_modules/.cache'

webpack compiled with 1 error
```

The solution was to specify a user in the Dockerfile:

```Dockerfile
FROM ...

USER node

# ...
```

Issue details [here][4]

## Known bugs

### Uncaught ReferenceError: process is not defined

```
Uncaught ReferenceError: process is not defined
    at Object.4043 (<anonymous>:2:13168)
    at r (<anonymous>:2:306599)
    at Object.8048 (<anonymous>:2:9496)
    at r (<anonymous>:2:306599)
    at Object.8641 (<anonymous>:2:1379)
    at r (<anonymous>:2:306599)
    at <anonymous>:2:315627
    at <anonymous>:2:324225
    at <anonymous>:2:324229
    at HTMLIFrameElement.e.onload (index.js:1)
```

Issue details [here][3]

## Using Hasura locally

To spin up the backend and the DB locally, run:

```shell
make run_hasura_locally
```

TODO: auto-apply migration on server start

## Icons

To add more SVG icons:

1. find the desired icon among [**free** ones](https://fontawesome.com/v6/search?o=r&m=free)
2. click on the icon
3. click on the SVG tab
4. copy the SVG code

You can see how to use CSS to style the SVG [here](https://docs.fontawesome.com/web/add-icons/svg-bare)

<!-- External references -->

[1]: https://mswjs.io/docs/getting-started/integrate/browser#setup "Mock Service Worker - Setup"
[2]: https://create-react-app.dev/docs/deployment/#building-for-relative-paths "Create React App - Building for relative paths"
[3]: https://stackoverflow.com/questions/70368760/react-uncaught-referenceerror-process-is-not-defined "React Uncaught ReferenceError: process is not defined"
[4]: https://stackoverflow.com/a/24555761/8038693
