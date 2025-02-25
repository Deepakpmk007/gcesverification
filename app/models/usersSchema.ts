import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  role: string;
  password: string;
  studentData: Array<string>;
  createdAt: Date;
}

const UsersSchema: Schema<IUser> = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "hod"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  studentData: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Users: Model<IUser> = models.Users || model<IUser>("Users", UsersSchema);

export default Users;
