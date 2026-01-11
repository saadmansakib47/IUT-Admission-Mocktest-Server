import multer from "multer";
import path from "path";
import fs from "fs";
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
export const csvUpload = multer({
    storage: multer.diskStorage({
        destination: (_, __, cb) => cb(null, uploadDir),
        filename: (_, file, cb) => {
            const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, unique + path.extname(file.originalname));
        },
    }),
    fileFilter: (_, file, cb) => {
        if (file.mimetype !== "text/csv") {
            cb(new Error("Only CSV files are allowed"));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
