import mongoose from "mongoose";
import { BaseDocument } from "./common.interface";

export interface Education {
  name: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
}

export interface NoExperience {
  type: "no-experience";
}

export interface Experience {
  type: "1-3 years" | "3-5 years" | "5-10 years" | "10+ years";
  company: string;
  location: string;
  role: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  noticePeriod: number;
}

export interface FixedSalary {
  type: "fixed";
  amount: number;
  currency: string;
}

export interface NegotiableSalary {
  type: "negotiable";
  min: number;
  max: number;
  currency: string;
}
export interface JobDocument extends BaseDocument {
  title: string;
  description: string;
  type: "full-time" | "part-time" | "freelance" | "remote" | "hybrid";
  education: Education;
  experience: NoExperience | Experience;
  skills: string[];
  salary: FixedSalary | NegotiableSalary;
  location: string;
  company: string;
  status: "active" | "inactive" | "draft";
  applicationDeadline?: Date;
  postedBy: mongoose.Types.ObjectId;
}
