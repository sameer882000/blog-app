const { validateToken } = require("../services/authentication");

function checkAuthentication(cookieName) {
  return (req, res, next) => {
    const token = req.cookies[cookieName];
    if (!token) return next();

    try {
      const userPayload = validateToken(token);
      req.user = userPayload;
    } catch (err) {}
    return next();
  };
}

module.exports = { checkAuthentication };
