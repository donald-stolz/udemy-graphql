import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const getUserId = (request, requireAuth = true) => {
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization;
  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  }
  if (requireAuth) {
    throw new Error("Authentication required");
  }
  return null;
};

const generateToken = id => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const hashPassword = password => {
  if (password.lenght < 8) {
    throw new Error("Password must be 8 characters or longer");
  }
  return bcrypt.hash(password, 10);
};

const checkPassword = (check, password) => {
  return bcrypt.compare(check, password);
};

export { getUserId, generateToken, hashPassword, checkPassword };
