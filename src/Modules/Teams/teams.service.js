import { requestsModel } from "../../DB/models/requests.model.js";
import { teamsModel } from "../../DB/models/teams.model.js";
import { asyncHandler } from "../../utils/error/index.js";

// ----------------------------- CREATE A TEAM(OR ADD TEAM MEMBERS) -----------------------------------------------------------------------
export const handleTeam = asyncHandler(async (req, res, next) => {
    const requestID = req.params.id
    const request = await requestsModel.findById(requestID);
    const acceptedBy = request.acceptedBy
    if(!request.team) {
        const team = await teamsModel.create({members: [request.sender, ...acceptedBy], admin: request.sender})
        request.team = team._id
        await request.save();
        return res.status(200).json({msg:"Team has been created", team})
    }
    else {
    const team = await teamsModel.findByIdAndUpdate(request.team._id, {$addToSet:{members: acceptedBy}})
    return res.status(200).json({msg:"Member added", team})
    }
    // else {
    //         
    //         return res.status(200).json({msg:"You have joined the team", team})
    //     }
})

// ------------------------------------- RETURN REQUESTED TEAMS --------------------------------------------------

export const returnTeams = asyncHandler(async (req, res, next) => {
    const senderID = req.user._id;
    const find = await requestsModel.find({sender: senderID})
    if(!find) {
        return res.status(400).json({msg:"You haven't requested any teams"})
    }
    return res.status(200).json({msg:"Here are your requested teams", teams: find})
})
// ------------------------------------ GET ALL TEAMS ------------------------------------------------------------------
export const getAllTeams = asyncHandler(async (req, res, next) => {
    const teams = await teamsModel.find().select("_id admin members").populate("members", "-_id firstName lastName Fullname isGraduated specialization hasProjects technology")//.lean({virtuals: ["Fullname"]});

    
    const cleanedTeams = teams.map(team => {
        const cleanedMembers = team.members.map(member => ({
        isGraduated: member.isGraduated,
        specialization: member.specialization,
        hasProjects: member.hasProjects,
        biography: member.biography,
        technology: member.technology,
        Fullname: member.Fullname
        }));
        return {teamID: team.id, members: cleanedMembers}
    });

    return res.status(200).json({ msg: "Here are all the teams", cleanedTeams });
});
// ------------------------------------ JOIN TEAM -----------------------------------------------------------------------

export const acceptJoin = asyncHandler(async (req, res, next) => {
    const requestID = req.params.id
    const {teamID} = req.body
    const request = await requestsModel.findById(requestID);
    const senderID = request.sender
    const team = await teamsModel.findById(teamID);
    if(team.members.includes(senderID)) {
        return res.status(400).json({msg:'Request already accepted'})
    }
    team.members.push(senderID)
    await team.save();
    return res.status(200).json({msg:"Member has joined the team"})
})