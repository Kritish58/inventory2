const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  //   assuming it has bearer
  let token = null;
  if (authHeader) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
