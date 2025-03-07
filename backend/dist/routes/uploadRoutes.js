"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FileUploadService_1 = require("../services/FileUploadService");
const PDFService_1 = require("../services/PDFService");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
const pdfService = new PDFService_1.PDFService();
router.post('/upload', FileUploadService_1.upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const text = await pdfService.extractText(req.file.path);
        const resumeId = (0, uuid_1.v4)();
        // Cleanup the uploaded file after processing
        await pdfService.cleanup(req.file.path);
        return res.json({
            id: resumeId,
            text: text
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map