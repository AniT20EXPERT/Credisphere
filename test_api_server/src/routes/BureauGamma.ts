import { Router, Request, Response } from "express";
import { QueryData } from "../helpers/QueryData";

const router = Router();

router.post("/api/gamma/credit", async (req: Request, res: Response) => {
    const { phone, name } = req.body;
    console.log(phone);
    res.send({ data: await QueryData(11, phone) });
});

router.post("/api/gamma/employment", async (req: Request, res: Response) => {
    const { phone, name } = req.body;
    console.log(phone);
    res.send({ data: await QueryData(12, phone) });
});

router.post("/api/gamma/payment_history", async (req: Request, res: Response) => {
    const { phone, name } = req.body;
    console.log(phone);
    res.send({ data: await QueryData(13, phone) });
});

router.post("/api/gamma/credit_utilization", async (req: Request, res: Response) => {
    const { phone, name } = req.body;
    console.log(phone);
    res.send({ data: await QueryData(14, phone) });
});

router.post("/api/gamma/dti_ratio", async (req: Request, res: Response) => {
    const { phone, name } = req.body;
    console.log(phone);
    res.send({ data: await QueryData(15, phone) });
});


export {router as BureauGammaRouter}