import mongoose from 'mongoose'

export const teamsSchema = new mongoose.Schema({
    name:{
        type: String
    },
    admin: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    members: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    
    
}, {
    timestamps: true
})

export const teamsModel = mongoose.models.Teams || mongoose.model("Teams", teamsSchema)