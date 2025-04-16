module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/hiv_spa/" : "/",
    devServer: {
      proxy: {
        '/api': {
          target: 'hiv-app-deploy-final.onrender.com', // Backend server URL
          changeOrigin: true,
        },
      },
    },
  };
  