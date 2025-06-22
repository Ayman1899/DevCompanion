import { Router } from "express";
import { acceptRequest } from "../Requests/requests.service.js";
import { authentication } from "../../middleware/auth.js";
import * as TS from "./teams.service.js";
export const teamRouter = Router();

teamRouter.post("/create/:id", TS.handleTeam)
teamRouter.get("/returnTeams", authentication, TS.returnTeams)
teamRouter.get("/getAllTeams", TS.getAllTeams)
teamRouter.post("/acceptJoin/:id", TS.acceptJoin)