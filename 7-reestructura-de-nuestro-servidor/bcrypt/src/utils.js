// import { hashSync, genSaltSync, compareSync } from "bcrypt";

// //Registro:
// export const createHash = (password) => {
//   return hashSync(password, genSaltSync(10));
// };

// //Login

//  * @param {*} password contraseña proporcionada por el usuario, sin hashear
//  * @param {*} user usuario existente en base de datos
//  * @returns boolean

// export const isValidPass = (password, user) => {
//   return compareSync(password, user.password);
// };



import { dirname } from "path";
import { fileURLToPath } from "url";
export const __dirname = dirname(fileURLToPath(import.meta.url));

import bcryptjs from "bcryptjs";

export const createHash = (password) =>
  bcryptjs.hashSync(password, bcryptjs.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcryptjs.compareSync(password, user.password);

export const createResponse = (res, statusCode, data) => {
  return res.status(statusCode).json({ data });
};