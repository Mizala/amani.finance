// src/services/gpt3Service.ts
import axios from 'axios';
import PdfParse from 'pdf-parse';
const pdf = require('pdf-parse');

class PDFService {
    async parsePdf(pdfUrl: string) {
        const pdf = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        const data = await PdfParse(pdf.data);
        return data.text;
    }
}

export default new PDFService();
