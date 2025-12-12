import { initServer } from "@ts-rest/express";
import { contract } from "../contract";
import { authRouter } from "./auth/router";
import { userRouter } from "./user/router";
import { packageRouter } from "./package/router";
import { courseRouter } from "./course/router";
import { financeRouter } from "./finance/router";
import { affiliateRouter } from "./affiliate/router";
import { webinarRouter } from "./webinar/router";
import { bankRouter } from "./bank/router";
import { tourRouter } from "./tour/router.router";
import { taskRouter } from "./task/router";
import { growRouter } from "./grow/router";

const s = initServer();

export const router = s.router(contract, {
  auth: authRouter,
  user: userRouter,
  package: packageRouter,
  course: courseRouter,
  finance: financeRouter,
  affiliate: affiliateRouter,
  webinar: webinarRouter,
  bank: bankRouter,
  tour: tourRouter,
  task: taskRouter,
  grow: growRouter
});
