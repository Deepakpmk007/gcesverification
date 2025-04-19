// models/Student.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  name: string;
  regNo: string;
  yearOfPassing: number;
  dob: Date;
  branch: string;
  duration: number; // duration of study in years
  cgpa: number;
}

const StudentSchema: Schema = new Schema({
  name: { type: String, required: true },
  regNo: { type: String, required: true, unique: true },
  yearOfPassing: { type: Number, required: true },
  dob: { type: Date, required: true },
  branch: { type: String, required: true },
  duration: { type: Number, required: true },
  cgpa: { type: Number, required: true, min: 0, max: 10 },
});

export default mongoose.models.Student ||
  mongoose.model<IStudent>("Student", StudentSchema);
