module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/hiv_spa/" : "/",
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // Backend server URL
          changeOrigin: true,
        },
      },
    },
  };
  