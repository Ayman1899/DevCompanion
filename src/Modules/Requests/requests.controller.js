import { Router } from "express";
import * as RS from "./requests.service.js";
import { authentication, authorization } from "../../middleware/auth.js";
import { roles } from "../../DB/models/user.model.js";
export const requestRouter = Router();

requestRouter.post("/sendRequest", authentication, authorization(roles.user), RS.sendRequest);
requestRouter.get("/getRequests",authentication, authorization(roles.user), RS.getRequests)
requestRouter.post("/askJoin", authentication, RS.askJoin)
requestRouter.post("/acceptRequest/:id", RS.acceptRequest);
requestRouter.post("/rejectRequest/:id", RS.rejectRequest)
requestRouter.get("/getAcceptedRequests/:id", RS.getAcceptedRequests);
requestRouter.post("/cancelSentRequest/:id", RS.cancelSentRequest);

