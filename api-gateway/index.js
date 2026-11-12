const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();   // no body parser here, the proxy needs the raw body

app.use(createProxyMiddleware('/api/register', {
  target: process.env.REGISTRATION_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: { '^/api/register': '/register' }
}));

app.use(createProxyMiddleware('/api/login', {
  target: process.env.LOGIN_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: { '^/api/login': '/login' }
}));

app.listen(3000, () => console.log('API Gateway on 3000'));
