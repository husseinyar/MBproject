import mongoose from "mongoose";

const Schema = mongoose.Schema;


const combinedSchema = new Schema({
  user: {
    username: { type: String, required: true },
    email: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    password:{ type: String, required: true },
    emailToken: { type: String},
    projectID: { type: String},
    countLoginTime:{ type: Date , default: null, }// last time user inlog the project.
  },
  project: {
    projectName: { type: String },
    projectNumber:  { type: String }, // Projektnummer
    client:  { type: String },// Byggherre/Beställare
    constructionStartdate:  { type: String, require:true }, // Byggstart- 
    constructionEnds_Date:  { type: String },// ByggSluter-
    projectAddress: { type: String },
    constructionType:  { type: String },// Typ av byggnation
    currentStage:  { type: String }, // Nuvarande skede
    customerID: { type: String },  // user ID or kund nam, depending on your use case
    customerName: { type: String }, // kund nam
    invoiceReference: { type: String },
   
  }
},{timestamps: true});

const CombinedModel = mongoose.model('Combined', combinedSchema);
export default CombinedModel;