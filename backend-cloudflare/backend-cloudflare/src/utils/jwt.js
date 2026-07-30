import { sign, verify } from "hono/jwt";

const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;

export const generateToken = async (userId, role, secret) => {
  const payload = {
    id: userId,
    role,
    exp: Math.floor(Date.now() / 1000) + SEVEN_DAYS_IN_SECONDS,
  };
  return sign(payload, secret);
};

export const verifyToken = async (token, secret) => {
  return verify(token, secret);
};
