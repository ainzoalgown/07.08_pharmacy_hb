const { verify } = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") next();

  try {

    if (!req.headers.authorization) return res.status(403).send("Пользователь не авторизован");
    const token = req.headers.authorization.split(" ")[1];

    req.user = verify(token, SECRET_KEY);
    next();

  } catch (e) {

    console.log(e);
    res.status(403).send("Пользователь не авторизован");

  }
};
