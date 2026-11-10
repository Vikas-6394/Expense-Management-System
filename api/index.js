let app;
let initError = null;

try {
  app = require('../backend/server');
} catch (err) {
  initError = {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code,
  };
  console.error('[API Init Error]:', err);
}

module.exports = (req, res) => {
  if (initError) {
    return res.status(500).json({
      success: false,
      error: 'API_INIT_FAILED',
      details: initError,
    });
  }

  try {
    return app(req, res);
  } catch (err) {
    console.error('[API Runtime Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'API_RUNTIME_ERROR',
      message: err.message,
      stack: err.stack,
    });
  }
};
