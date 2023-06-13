const { createProxyMiddleware } = require('http-proxy-middleware');

const paymentGatewayProxy  = createProxyMiddleware({
    target: 'https://development.payzah.net/ws/paymentgateway',
    changeOrigin: true,
    pathRewrite: {
        '/paymentgateway': '', // Remove the '/api/paymentgateway' prefix
      },
    // Add any additional options as needed
});

module.exports = paymentGatewayProxy