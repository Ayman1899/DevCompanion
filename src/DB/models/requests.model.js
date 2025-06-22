import mongoose from "mongoose";

export const requestStatus = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected"
}

const requestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    recepients: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }],
    acceptedBy: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: []
        
    }],
    rejectedBy: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    message: {
        type: String,
        minLength: 1,
        maxLength: 200,
        required: true
    },
    // status: {
    //     type: String,
    //     enum: Object.values(requestStatus),
    //     default: requestStatus.pending
    //},
    team: {
        type: mongoose.Schema.ObjectId,
        ref: "Teams"
    }
},{
    timestamps: true
})

export const requestsModel = mongoose.models.Requests || mongoose.model("Requests", requestSchema)