const path = require('path');

module.exports = {
  entry: {
    app: './js/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'js/dist'),
    clean: true,
    filename: 'app.bundle.js',
  },
};
