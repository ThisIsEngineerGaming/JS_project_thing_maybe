const path = require('path');

module.exports = {
  entry: {
    app:   './js/app.js',
    admin: './js/admin.js',
    theme: './js/theme.js',
    cart:  './js/entities/Cart.js',
  },
  output: {
    path: path.resolve(__dirname, 'js/dist'),
    clean: true,
    filename: '[name].bundle.js',
  },
};
