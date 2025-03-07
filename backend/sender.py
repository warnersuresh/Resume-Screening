from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Remove trailing slash
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Replace with your email credentials
EMAIL_ADDRESS = "sathish2222k0150@gmail.com"
EMAIL_PASSWORD = "rkrq flug dyeb gcou"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

class EmailRequest(BaseModel):
    email: str
    decision: str

@app.options("/send_email/")
async def options_handler():
    return JSONResponse(content={}, status_code=200)

@app.post("/send_email/")
async def send_email(request: EmailRequest):
    try:
        subject = "Resume Review Decision"
        message = f"Dear Candidate,\n\nYour resume has been {request.decision}.\n\nBest Regards,\nHR Team"

        msg = MIMEMultipart()
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = request.email
        msg['Subject'] = subject
        msg.attach(MIMEText(message, 'plain'))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, request.email, msg.as_string())

        return {"message": f"Email sent successfully to {request.email}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending email: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=4000)
