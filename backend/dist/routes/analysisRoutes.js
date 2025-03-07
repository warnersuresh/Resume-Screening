"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportGenerator_service_1 = require("../services/reportGenerator.service");
const atsAnalysis_service_1 = require("../services/atsAnalysis.service");
const jobMatch_service_1 = require("../services/jobMatch.service");
const resumeStructure_service_1 = require("../services/resumeStructure.service");
const groq_sdk_1 = require("groq-sdk");
const router = (0, express_1.Router)();
const groq = new groq_sdk_1.Groq({
    apiKey: process.env.GROQ_API_KEY
});
const reportGenerator = new reportGenerator_service_1.ReportGeneratorService(new atsAnalysis_service_1.ATSAnalysisService(groq), new jobMatch_service_1.JobMatchService(groq), new resumeStructure_service_1.ResumeStructureService(groq), groq);
router.post('/analyze', async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;
        if (!resumeText || !jobDescription) {
            return res.status(400).json({
                error: 'Both resumeText and jobDescription are required'
            });
        }
        const report = await reportGenerator.generateReport(resumeText, jobDescription);
        return res.json(report);
    }
    catch (error) {
        console.error('Analysis error:', error);
        return res.status(500).json({
            error: 'Failed to analyze resume',
            details: error.message
        });
    }
});
exports.default = router;
//# sourceMappingURL=analysisRoutes.js.map