import express from "express"
import cors from "cors"
import bodyParser from "body-parser"

import { ReceiveApiRouter } from "./routes/ReceiveApi";
import { UploadRouter } from "./routes/ReceiveFile";
import { LLMRouter } from "./routes/LLMInterface";

const app = express();
app.use(bodyParser.json())
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(ReceiveApiRouter)
app.use(UploadRouter)
app.use(LLMRouter)

app.listen(4000, process.env.HOST_IP!);