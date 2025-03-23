import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import {BureauAlphaRouter} from "./routes/BureauAlpha"
import {BureauBetaRouter} from "./routes/BureauBeta"
import {BureauGammaRouter} from "./routes/BureauGamma"

// We need 

const app = express();
app.use(bodyParser.json())
app.use(cors())

app.use(BureauAlphaRouter)
app.use(BureauBetaRouter)
app.use(BureauGammaRouter)


app.listen(4001, "192.168.1.11");