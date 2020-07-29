# :bomb: Project «Minesweeper» by [Ania Kubów](https://www.youtube.com/c/AniaKub%C3%B3w)

[![Build status][travis-image]][travis-url] [![Dependency status][dependency-image]][dependency-url]

Code by: [Rostyslav Miniukov](https://github.com/embyth/)

[Project Demo](https://embyth.github.io/minesweeper/)

---

## Usage

`npm install` - install dependencies.

`npm start` - building project in dev mode and launching local server.

`npm run build` - building project.

`npm run deploy` - building project and deploying it on [GitHub Pages](https://pages.github.com).

`npm run dist` - building project and archieving it in zip.

`npm test` - launching linting test.

---

## Project Structure

```bash
.
├── img/              # images directory
├── js/               # JavaScript directory
├── css/              # styles directory
├── index.html        # page mark-up file
├── .babelrc          # Babel config
├── .editorconfig     # Editor config
├── .eslintrc         # ESLint config
├── .eslintignore     # ESLint ignore file
├── .gitattributes    # Git attributes file
├── .gitignore        # Git ignore file
├── .travis.yml       # Travis CI config
├── gulpfile.js       # Gulp tasks file
├── package.json      # npm dependencies and project settings file
├── package-lock.json # npm lock-file
└── README.md         # project documents
```

[travis-image]: https://travis-ci.org/embyth/minesweeper.svg?branch=master
[travis-url]: https://travis-ci.org/embyth/minesweeper
[dependency-image]: https://david-dm.org/embyth/minesweeper/dev-status.svg?style=flat-square
[dependency-url]: https://david-dm.org/embyth/minesweeper?type=dev
