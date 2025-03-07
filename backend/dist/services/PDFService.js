"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFService = void 0;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const promises_1 = __importDefault(require("fs/promises"));
class PDFService {
    async extractText(filePath) {
        try {
            const dataBuffer = await promises_1.default.readFile(filePath);
            const data = await (0, pdf_parse_1.default)(dataBuffer);
            return data.text;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to extract text from PDF: ${error.message}`);
            }
            else {
                throw new Error('Failed to extract text from PDF: Unknown error');
            }
        }
    }
    async cleanup(filePath) {
        try {
            await promises_1.default.unlink(filePath);
        }
        catch (error) {
            console.error(`Failed to delete file ${filePath}:`, error);
        }
    }
}
exports.PDFService = PDFService;
//# sourceMappingURL=PDFService.js.map