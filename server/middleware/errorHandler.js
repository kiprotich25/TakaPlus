module.exports = function errorHandler(err, req, res, next) { // (1)
  console.error(err.stack); // (2)
  const status = err.status || 500; // (3)
  res.status(status).json({ error: err.message || 'Internal Server Error' }); // (4)
};
