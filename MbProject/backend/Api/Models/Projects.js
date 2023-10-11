const  mongoose = require ("mongoose");

const ProjectsSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    company:{type:String,required: true,  min: 2,  max: 50,},
    client:{
    type: String,
    required: true,
    min: 2,
    max: 50,
   },

   adrees: {
    type: Array,
    default: [],
   }, 
  
   starProjects: {type:Date, default: Date.now},
   endProjects: Date,
   amount_of_total_plan_projects: {type:String, default: null},
   userId: {
    type: String,
    required: true,
  },
  },
  { timestamps: true }
);

const User = mongoose.model("Projects", ProjectsSchema);

module.exports = User;