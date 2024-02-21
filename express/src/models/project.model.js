import mongoose,{Schema} from "mongoose";

const projectSchema = new Schema({
    projectId:{
        type:String,
        required:true
    },
    projectVideo:{
        type:String,
    }
}, { timestamps: true });
export const Project = mongoose.model("Project", projectSchema);