import { Response, Router } from "express";
import { HTTP_STATUS } from "../constants/http-status";
import authroutes from './auth.routes'

const router:Router = Router()

router.get("/healthcheck", (_, res:Response)=>{
    res.status(HTTP_STATUS.OK).send("OK")
})

router.use("/api/v1/auth", authroutes);

export default router