import { requestsModel, requestStatus } from "../../DB/models/requests.model.js";
import { teamsModel } from "../../DB/models/teams.model.js";
import { userModel } from "../../DB/models/user.model.js";
import { sendNotification } from "../../service/firebase.js";
import { asyncHandler } from "../../utils/error/index.js";

// ------------------------------------ SEND REQUESTS ---------------------------------------------------------------

export const sendRequest = asyncHandler(async (req, res, next) => {
    const SenderId = req.user._id
    const { recepientIDs, message, teamID } = req.body
    const [request, users] = await Promise.all([
        requestsModel.create({sender: SenderId, recepients: recepientIDs, message, team: teamID}),
        userModel.find({_id: recepientIDs}).lean()
    ])
    if(recepientIDs.includes(SenderId) || recepientIDs === 0) {
    return next(new Error("Please add reccepients or Can't send request to yourself dumbass", {cause:400}))
    }
    const tokens = users.map(user => user.fcmToken).filter(Boolean);
    if(!request){
        return next(new Error("An error has occurred",{cause: 500}))
    }
    await sendNotification(
        {
            title: `${req.user.Fullname} has sent you a request`,
            body: message,
        },
        {
            type: "send_request"
        },
        tokens
    );
    
    res.status(200).json({msg:"Request sent", requestID: request._id})
})
// ------------------------------------- GET REQUESTS ---------------------------------------------------------------
export const getRequests = asyncHandler(async (req, res, next) => {
    const userID = req.user._id
    const requests = await requestsModel.find({recepients:{$in: userID}}).populate("sender")
    if(!requests || requests == {}) {
        return next(new Error("Request not found or You have no requests", {cause: 400}))
    }
    let sender = []
    for(let i = 0; i < requests.length; i++) {
        sender.push(requests[i].sender)
    }
    
    const cleanedProfile = sender.map(user => ({
        isGraduated: user.isGraduated,
        specialization: user.specialization,
        hasProjects: user.hasProjects,
        biography: user.biography,
        technology: user.technology,
        Fullname: user.Fullname
    }));
    return res.status(200).json({msg:"Here are the requests", cleanedProfile})
})
// ------------------------------------- ACCEPT REQUESTS ------------------------------------------------------------

export const acceptRequest = asyncHandler(async (req, res, next) => {
    const  requestID  = req.params.id
    const { recepientID } = req.body
    const request = await requestsModel.findById(requestID)
    if(!request) {
        return next(Error("Request not found", { cause: 400 }))
    }
    if(request.acceptedBy.includes(recepientID)) {
        return next(Error("Request already accepted", {cause: 400}))
    }
    request.acceptedBy.push(recepientID)
    await request.save()
    return res.status(200).json({msg:"Request accepted"})
    // req.request = request
    // req.recepient = recepientID
    // return next();
    // const team = await teamsModel.create({members: [request.sender, request.recepients]})
    // return res.status(200).json({msg:"Request accepted and Team is created", team})
})

// ----------------------------- GET ACCEPTED REQUESTS -----------------------------------------------------------

export const getAcceptedRequests = asyncHandler(async (req, res, next) => {
    const requestID = req.params.id
    const request = await requestsModel.findById(requestID).populate("acceptedBy",'Fullname firstName lastName isGraduated specialization technology hasProjects biography _id')//.lean({virtuals: ["Fullname"]})
    if(!request) {
        return next(Error("Request not found", { cause: 400 }))
    }
    if(request.acceptedBy.length == 0) {
        return res.status(200).json({msg:"No one has accepted the request yet"})
    }    
    const acceptedBy = request.acceptedBy
    //const cleanedAcceptedBy = acceptedBy.map(({ firstName, lastName, id, ...rest }) => rest);
    // const cleanedMatch = acceptedBy.map(user => {
    //     delete user.firstName;
    //     delete user.lastName;
    //     delete user.id
    //     return user;
    // });
    const cleanedMatch = acceptedBy.map(user => ({
        isGraduated: user.isGraduated,
        specialization: user.specialization,
        hasProjects: user.hasProjects,
        biography: user.biography,
        technology: user.technology,
        Fullname: user.Fullname
    }));
    return res.status(200).json({msg:"Done", acceptedBy: cleanedMatch})
})

// ---------------------------- REJECT REQUEST -----------------------------------------------------------------------------

export const rejectRequest = asyncHandler(async (req, res, next) => {
    const  requestID  = req.params.id
    const { recepientID } = req.body
    const request = await requestsModel.findById(requestID)
    if(!request) {
        return next(Error("Request not found", { cause: 400 }))
    }
    if(request.rejectedBy.includes(recepientID)) {
        return next(Error("Request already accepted", { cause: 400 }))
    }
    request.rejectedBy.push(recepientID)
    await request.save()
    return res.status(200).json({msg:"Request accepted"})
})

// --------------------------- CANCEL SENT REQUEST -------------------------------------------------------------------------

export const cancelSentRequest = asyncHandler(async (req, res, next) => {
    const  requestID  = req.params.id
    const { recepientID } = req.body
    const request = await requestsModel.findById(requestID)
    if(!request) {
        return next(Error("Request not found", { cause: 400 }))
    }
    const index = request.recepients.indexOf(recepientID)
    if(index > -1) {
        request.recepients.splice(index, 1)
        await request.save()
    }
    else {
        return res.status(200).json({msg:"User didn't receive a request"})
    }
    return res.status(200).json({msg:"Done"})
})


// ------------------------------------ ASK TO JOIN TEAM -----------------------------------------------------------------------
export const askJoin = asyncHandler(async (req, res, next) => {
    const senderID = req.user._id
    const { teamID, message } = req.body
    const team = await teamsModel.findById(teamID)    
    const adminID = team.admin
    // if(senderID == recepientIDs) {
    // return next(Error("Can't send request to yourself dumbass", {cause:400}))
    // }
    const exists = await requestsModel.findOne({team: teamID /*status: requestStatus.pending*/})
    if(exists) {
        return next(Error("Request already sent to this team", {cause: 400}))
    }
    await requestsModel.create({sender: senderID, recepients: adminID, message, team: teamID})
    
    return res.status(200).json({msg:"Request to join team sent"})
})

// ---------------------------------------- GET REQUEST TO JOIN --------------------------------------------------
export const getReqJoin = asyncHandler(async (req, res, next) => {
    const 
})
//check if cancelSentJoin and rejectJoin are needed