
import mongoose from "mongoose"
import mongooseLeanVirtuals from "mongoose-lean-virtuals"

export const roles = {
    user: "User",
    admin: "Admin"
}
const yesandno = {
    yes: "Yes",
    no: "No"
}
const dropdown = {
    choice1: "Option 1",
    choice2: "Option 2"
}

export const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,"'Email is required"],
        trim: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Please enter a valid email"],
        lowercase: true
    },
    firstName: {
        type: String,
        required: [true, "Name is required"],
        minLength: [3,"Enter a minimum of 3 characters"],
        maxLength: 10,
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Name is required"],
        minLength: [3,"Enter a minimum of 3 characters"],
        maxLength: 10,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength:8
        //match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/]
    },
    role:{
        type: String,
        enum: Object.values(roles),
        default: roles.user
    },
    imageUrl: {
        type: String
    },
    latitude: {
        type: Number,

    },
    longitude: {
        type: Number,
    },
    isGraduated: {
        type: String,
        required: true,
        enum: Object.values(yesandno)
    },
    specialization: {
        type: String,
        required: true
    },
    technology:{
        type: String,
        required: true
    },
    hasProjects: {
        type: String,
        required: true
    },
    biography: {
        type: String,
        minLength: 10,
        maxLength: 150
    },
    reasonToJoin: {
        type: String,
        required: true,
        enum: Object.values(dropdown)
    },
    confirmed: {
        type: Boolean,
        default: true
    },
    fcmToken: {
        type: String,
        required: true
    },
    otpEmail: String

},{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

userSchema.plugin(mongooseLeanVirtuals)
userSchema.virtual("Fullname").get(function() { return `${this.firstName} ${this.lastName}` }).
set(function(fullName) {
const parts = fullName.split(" ")
this.firstName = parts[0]
this.lastName = parts.slice(1).join(" ")
})

export const userModel = mongoose.model.User || mongoose.model("User", userSchema)