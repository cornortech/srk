import { initServer } from "@ts-rest/express";
import { webinarContract } from "../../contract/webinar/contract";
import { webinarMutationHandler } from "./mutation";
import { webinarQueryHandler } from "./query";
const s = initServer();

export const webinarRouter = s.router(webinarContract, {
  createWebinar: webinarMutationHandler.createWebinar,
  getAllWebinars: webinarQueryHandler.getAllWebinar,
  deleteWebinar: webinarMutationHandler.deleteWebinar,
  updateWebinar: webinarMutationHandler.updateWebinar,
});