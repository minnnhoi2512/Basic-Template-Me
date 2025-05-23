export default () => ({
  port: parseInt(process.env.PORT || '9999', 10),
  mode: process.env.NODE_ENV,
  auth: process.env.AUTH,
});
