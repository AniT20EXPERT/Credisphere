import { Router, Request, Response } from "express";
import { QueryData } from "../helpers/QueryData";

const router = Router();

router.post("/api/beta/credit", async (req: Request, res: Response) => {
    const { phone, name } = req.body;
    console.log(phone);
    res.send({ data: await QueryData(6, phone) });
});

router.post("/api/beta/employment", async (req: Request, res: Response) => {
    const { phone, name } = req.body;
    console.log(phone);
    res.send({ data: await QueryData(7, phone) });
});

router.post("/api/beta/payment_history", async (req: Request, res: Response) => {
    const { phone, name } = req.body;
    console.log(phone);
    res.send({ data: await QueryData(8, phone) });
});

router.post("/api/beta/credit_utilization", async (req: Request, res: Response) => {
    const { phone, name } = req.body;
    console.log(phone);
    res.send({ data: await QueryData(9, phone) });
});

router.post("/api/beta/dti_ratio", async (req: Request, res: Response) => {
    const { phone, name } = req.body;
    console.log(phone);
    res.send({ data: await QueryData(10, phone) });
});
export {router as BureauBetaRouter}