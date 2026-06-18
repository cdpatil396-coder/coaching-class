const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {

  let token =
  req.headers.authorization;

  if (!token) {

    return res.status(401).json({
      message: "Not authorized"
    });

  }

  token = token.split(" ")[1];

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid token"
    });

  }

};

exports.adminOnly = (
  req,
  res,
  next
) => {

  if (req.user.role !== "admin") {

    return res.status(403).json({
      message: "Admin only"
    });

  }

  next();

};