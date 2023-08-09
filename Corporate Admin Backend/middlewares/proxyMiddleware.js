const { createProxyMiddleware } = require('http-proxy-middleware');

const paymentGatewayProxy = createProxyMiddleware({
  target: 'https://development.payzah.net/ws/paymentgateway',
  changeOrigin: true,
  pathRewrite: {
    '/paymentgateway': '',
    
  },
});


module.exports = paymentGatewayProxy