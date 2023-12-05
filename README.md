# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation
Make sure you have `Node` version 18 or above installed. Then at the root of this repository, run: 

```
$ yarn install
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

We use Github workflows to automate the deployment to Github pages. If you wish to deploy it manually:

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.