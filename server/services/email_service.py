import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
import os
import secrets
from server.extensions import db
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

def send_verification_email(user):
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

    # Generate token and set expiry
    token = secrets.token_urlsafe(32)
    code = ''.join(secrets.choice('0123456789') for _ in range(6))  # 6-digit code

    user.verification_token = token
    user.verification_code = code

    user.verification_token_expiry = datetime.utcnow() + timedelta(minutes=10)
    db.session.commit()

    sender = {
        "email": os.getenv("MAIL_DEFAULT_SENDER"), 
        "name": "Helping Hands"
    }

    # Recipient
    to = [{
        "email": user.email,
        "name": user.full_name
    }]

    subject = "Verify your email"
    html_content = f"""
    <html>
    <body>
        <h1>Email Verification</h1>
        <p>Hello {user.full_name},</p>
        <p>Please verify your email using this 6-digit code:</p>
        <h2 style="font-size: 24px; letter-spacing: 3px; margin: 20px 0;">
            {code}
        </h2>
        <p>This code expires in 10 minutes.</p>
        <p>Alternatively, you can click this link to verify:</p>
        <a href="http://localhost:5173/verify-email?token={token}">
            Verify Email
        </a>
    </body>
    </html>
    """

    # Build email payload
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=to,
        sender=sender,
        subject=subject,
        html_content=html_content
    )

    #
    try:
        response = api_instance.send_transac_email(send_smtp_email)
        logger.info(f"Verification email sent to {user.email}. Response: {response}")
    except ApiException as e:
        logger.error(f"Failed to send verification email to {user.email}. Brevo error: {e}")
