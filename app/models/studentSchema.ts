import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudent extends Document {
  uniqueId: string;
  name: string;
  dateOfBirth: string;
  regNo: number;
  degree: string;
  branch?: string;
  nameOfTheInstitution?: string;
  university?: string;
  yearOfPassing?: string;
  yearOfStudy?: string;
  CGPA?: string;
  backlogs?: string;
  classObtain?: string;
  remark?: string;
  file?: string[];
  verified: boolean;
  verifiedBy?: string;
  fileIds?: string[];
  agencyName?: string;
  senderEmail: string;
  contact: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema<IStudent> = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    dateOfBirth: {
      type: String,
      required: [true, "Date of Birth is required."],
    },
    regNo: {
      type: Number,
      required: [true, "Registration number is required."],
    },
    degree: {
      type: String,
      default: "B.E",
    },
    branch: {
      type: String,
    },
    nameOfTheInstitution: {
      type: String,
      default: "Government College of Engineering Srirangam, Trichy 620012",
    },
    university: {
      type: String,
      default: "Anna University Chennai",
    },
    yearOfPassing: {
      type: String,
    },
    yearOfStudy: {
      type: String,
    },
    CGPA: {
      type: String,
    },
    backlogs: {
      type: String,
    },
    classObtain: {
      type: String,
    },
    remark: {
      type: String,
      default: null,
      trim: true,
    },
    file: {
      type: [String],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: String,
    },
    fileIds: { type: [String] },
    agencyName: {
      type: String,
    },
    senderEmail: {
      type: String,
      required: [true, "Sender email is required."],
    },
    contact: {
      type: Number,
      required: [true, "Contact number is required."],
    },
  },
  { timestamps: true }
);

const StudentData: Model<IStudent> =
  mongoose.models.StudentData ||
  mongoose.model<IStudent>("StudentData", StudentSchema);

export default StudentData;
