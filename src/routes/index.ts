import { Response, Router } from "express";
import { HTTP_STATUS } from "../constants/http-status";

const router:Router = Router()

router.get("/healthcheck", (_, res:Response)=>{
    res.status(HTTP_STATUS.OK).send("OK")
})

export default router