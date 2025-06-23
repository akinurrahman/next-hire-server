import mongoose from "mongoose";

export interface JobDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type : "full-time" | "part-time" | "freelance" | "remote" | "hybrid";
  education : {
    name : string;
    startDate : Date;
    endDate?: Date;
    isCurrent : boolean;
  };
  experience : {
    type : "no-experience" | "1-3 years" | "3-5 years" | "5-10 years" | "10+ years";
  } | {
    type : "1-3 years" | "3-5 years" | "5-10 years" | "10+ years";
    company: string;
    location: string;
    role: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
    noticePeriod: number;
  };
  skills : string[];
  salary : {
    type : "fixed" | "negotiable";
    min : number;
    max : number;
    currency : string;
    negotiable : boolean;
  }
  location : string;
  company : string;
  status : "active" | "inactive";
  applicationDeadline?: Date;
  postedBy : mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new mongoose.Schema({
  title : {type : String, required : true},
  description : {type : String, required : true},
  type : {type : String, enum : ["full-time", "part-time", "freelance", "remote", "hybrid"], required : true},
  education : {type : Object, required : true},
  experience : {type : Object, required : true},
  skills : {type : [String], required : true},
  salary : {type : Object, required : true},
  location : {type : String, required : true},
  company : {type : String, required : true},
  status : {type : String, enum : ["active", "inactive"], required : true},
  applicationDeadline : {type : Date},
  postedBy : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
}, {timestamps : true});

const Job = mongoose.model<JobDocument>("Job", jobSchema);

export default Job;