import jwt from "jsonwebtoken";
import { env } from "~/env";

/*** token: string
 *
 * Check if the JWT token is expired
 *
 * In `production` we need to adjust the expiry time by 60 seconds
 * to ensure that the token is invalidated,
 *
 * this eliminates race condition between
 * client side jwt validation and server side jwt validation
 */
export const isJwtExpired = (token: string) => {
  const currentTime =
    Math.floor(Date.now() / 1000) + (env.NODE_ENV === "production" ? 60 : 0);
  const decoded = jwt.decode(token);
  if (decoded && typeof decoded === "object" && decoded?.exp) {
    const adjustedExpiry = decoded.exp;
    return adjustedExpiry < currentTime;
  }
  return true;
};

export const getRefreshTokenExpiry = (token: string) => {
  const decoded = jwt.decode(token);
  if (decoded && typeof decoded === "object" && decoded?.exp) {
    const adjustedExpiry = decoded.exp;
    return adjustedExpiry;
  }
  return 0;
};
