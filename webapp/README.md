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

<!-- External references -->

[1]: https://mswjs.io/docs/getting-started/integrate/browser#setup "Mock Service Worker - Setup"
[2]: https://create-react-app.dev/docs/deployment/#building-for-relative-paths "Create React App - Building for relative paths"
[3]: https://stackoverflow.com/questions/70368760/react-uncaught-referenceerror-process-is-not-defined "React Uncaught ReferenceError: process is not defined"