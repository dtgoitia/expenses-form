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

<!-- External references -->

[1]: https://mswjs.io/docs/getting-started/integrate/browser#setup "Mock Service Worker - Setup"
[2]: https://create-react-app.dev/docs/deployment/#building-for-relative-paths "Create React App - Building for relative paths"
