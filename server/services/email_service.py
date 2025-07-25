import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
import os
import secrets
from server.extensions import db

from datetime import datetime, timedelta

def send_verification_email(user):
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

    # Generating token with expiry
    token = secrets.token_urlsafe(32)
    user.verification_token = token
    user.verification_token_expiry = datetime.utcnow() + timedelta(minutes=10)
    db.session.commit()

    sender = {"email": os.getenv("SENDER_EMAIL"), "name": "Helping Hands"}
    to = [{"email": user.email, "name": user.full_name}]
    subject = "Verify your email"
    html_content = f"""
    <html>
    <body>
        <h1>Email Verification</h1>
        <p>Hello {user.full_name},</p>
        <p>Please verify your email by clicking the link below. This link expires in 1 hour.</p>
        <a href="https://yourfrontend.com/verify-email?token={token}">Verify Email</a>
    </body>
    </html>
    """

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=to,
        sender=sender,
        subject=subject,
        html_content=html_content
    )

    try:
        api_instance.send_transac_email(send_smtp_email)
        print(f"Verification email sent to {user.email}")
    except ApiException as e:
        print(f"Exception when sending email: {e}")
