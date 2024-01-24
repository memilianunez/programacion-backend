import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  firstname: { type: String, require: true },
  lastname: { type: String, require: true },
  age: { type: Number, require: true },
  role: { type: String, enum: ['usuario', 'admin'], default: 'usuario' }, 
});

export const UserModel = model("users", UserSchema);