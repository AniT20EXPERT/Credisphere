import { Router, Request, Response } from "express";
import { QueryData } from "../helpers/QueryData";

const router = Router();

router.post("/api/alpha/credit", async (req: Request, res: Response)=>{
    const {phone, name} = req.body;
    console.log(phone)
    res.send({data: await QueryData(1, phone)})
})

router.post("/api/alpha/employment", async (req: Request, res: Response)=>{
    
    const {phone, name} = req.body;
    console.log(phone)
    res.send({data: await QueryData(2, phone)})
})

router.post("/api/alpha/payment_history", async (req: Request, res: Response)=>{
    const {phone, name} = req.body;
    console.log(phone)
    res.send({data: await QueryData(3, phone)})
})

router.post("/api/alpha/credit_utilization", async (req: Request, res: Response)=>{
    const {phone, name} = req.body;
    console.log(phone)
    res.send({data: await QueryData(4, phone)})
})

router.post("/api/alpha/dti_ratio", async (req: Request, res: Response)=>{
    const {phone, name} = req.body;
    console.log(phone)
    res.send({data: await QueryData(5, phone)})
})


export {router as BureauAlphaRouter}