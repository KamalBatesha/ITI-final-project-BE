import { UserModel } from "../DB/models/index.js";
import { asyncHandler } from "../utils/globalErrorHandling/index.js";
import { verifyToken } from "../utils/token/verifyToken.js";

const roles = {
  admin: "admin",
  user: "bearer",
};
export const tokenTypes = {
  acess: "acess",
  refresh: "refresh",
  email: "email",
};

export const decodedToken = async ({ authorization, tokenType, next }) => {
  if (!authorization) {
    return next(new Error("No authorization header provided", { cause: 400 }));
  }

  const [prefix, token] = authorization.split(" ");
  if (!prefix || !token) {
    return next(new Error("No token provided", { cause: 400 }));
  }

  let REFRESH_SIGNATURE, ACESS_SIGNATURE, SIGNATURE_TOKEN_EMAIL;
  if (prefix === roles.admin) {
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_TOKEN_ADMIN;
    ACESS_SIGNATURE = process.env.ACESS_SIGNATURE_TOKEN_ADMIN;
  } else if (prefix === roles.user) {
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_TOKEN_USER;
    ACESS_SIGNATURE = process.env.ACESS_SIGNATURE_TOKEN_USER;
  } else if (prefix === "email") {
    SIGNATURE_TOKEN_EMAIL = process.env.SIGNATURE_TOKEN_EMAIL;
  } else {
    return next(new Error("Invalid token prefix", { cause: 401 }));
  }

  let SIGNATURE;
  if (SIGNATURE_TOKEN_EMAIL) {
    SIGNATURE = SIGNATURE_TOKEN_EMAIL;
  } else if (tokenType === tokenTypes.acess) {
    SIGNATURE = ACESS_SIGNATURE;
  } else if (tokenType === tokenTypes.refresh) {
    SIGNATURE = REFRESH_SIGNATURE;
  } else {
    return next(new Error("Invalid token type", { cause: 401 }));
  }

  const decoded = await verifyToken({ token, SIGNATURE });

  if (!decoded?.id && !decoded?.email) {
    return next(new Error("Invalid token payload", { cause: 401 }));
  }

  let user;
  if (decoded?.id) {
    user = await UserModel.findById(decoded.id);
  } else if (decoded?.email) {
    user = await UserModel.findOne({ email: decoded.email });
  }

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  if (user?.deletedAt) {
    return next(new Error("User deleted", { cause: 404 }));
  }

  return user;
};

export const authentication = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const user = await decodedToken({
    authorization,
    tokenType: tokenTypes.acess,
    next,
  });

  req.user = user;
  next();
});

export const authorization = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      return next(new Error("Access denied", { cause: 403 }));
    }
    next();
  });
};

