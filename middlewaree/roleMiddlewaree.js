const { verify } = require("jsonwebtoken");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") next();

    try {
      if (!req.headers.authorization) return res.status(403).send("Пользователь не авторизован");
      const token = req.headers.authorization.split(" ")[1];

      const { roles: userRoles } = verify(token, SECRET_KEY);
      let hasRole = false;
      userRoles.forEach((role) => (hasRole = roles.includes(role)));

      if (!hasRole) return res.status(403).json({ message: "У вас нет доступа" });

      next();
    } catch (e) {
      console.log(e);
      return res.status(403).json({ message: "Пользователь не авторизован" });
    }
  };
};
