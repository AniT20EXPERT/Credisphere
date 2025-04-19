import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
// Chat endpoint
const BASE_URL = process.env.FLASK_URL
const router = Router()
router.use(cookieParser());
// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "uploads");
        console.log(uploadDir)
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir); // Create "uploads" directory if it doesn't exist
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${req.body.id} ${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Define the types for uploaded files
interface UploadedFile {
    filename: string;
    path: string;
}



router.post("/upload", upload.array("files", 10), async (req: Request, res: Response) => {
    try {
        const { insights, report_id  } = req.body;

        const files = req.files as Express.Multer.File[];
        console.log("Files received:", req.files); 
        const headers = {
            "Content-Type": "application/json"
        };
        console.log(insights, report_id)


        // Call `/add_insights`
        const response1 = await axios.post(`${BASE_URL}/add_insights`, {report_id, insights}, { headers });
        console.log("added insights...");
        // Call `/clear-memory`
        console.log("Clearing memory...");
        const response = await axios.post(`${BASE_URL}/clear-memory`, {}, { headers });
        console.log("Memory Cleared:", response.data);

      const uploadedFiles: UploadedFile[] = files.map((file) => {
            const ext = path.extname(file.originalname); // Extract file extension
            const newFilename = `${path.basename(file.filename, ext)}-${report_id}${ext}`;
            const newPath = path.join(path.dirname(file.path), newFilename);

            // Rename the file on disk to match the new filename
            fs.renameSync(file.path, newPath);

            return {
                filename: newFilename,
                path: newPath,
            };
        });

        // Call `/load-documents`
        console.log("Loading documents...");
         const response2 = await axios.post(
          `${BASE_URL}/load-documents`,
          {
           report_id
           // send insights here and get it on llm's side
         },
         { headers });
        console.log("Documents Loaded:", response2.data);
        
        res.status(200).json({
            message: "Files uploaded successfully",
            files: uploadedFiles,
        });



        // change this to LLM output
        // implement flask server calling here

        // fetch report information from the report ID provided in the header

        // Change below code to send formatted data
        // res.status(200).json({
        //     message: "Files uploaded successfully",
        //     files: uploadedFiles,
        // });


    } catch (error) {
        res.status(500).json({ message: "Error uploading files", error });
    }
});


export { router as UploadRouter }