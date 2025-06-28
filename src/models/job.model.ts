import mongoose from "mongoose";
import { JobDocument } from "../interfaces/job.interface";


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
  status : {type : String, enum : ["active", "inactive", "draft"], default : "draft", required : true},
  applicationDeadline : {type : Date},
  postedBy : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
}, {timestamps : true});

const JobModel = mongoose.model<JobDocument>("Job", jobSchema);

export default JobModel;