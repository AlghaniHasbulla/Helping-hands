import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv() 


cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

# Constants
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE_MB = 5


# Check if file type is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


#file size is within the limit
def is_file_size_okay(file):
    file.seek(0, 2)  
    size = file.tell() 
    file.seek(0)  
    return size <= MAX_FILE_SIZE_MB * 1024 * 1024



def upload_image(file):
    try:
        if not allowed_file(file.filename):
            return {"error": "Invalid file type. Only images allowed (png, jpg, jpeg, gif)."}, 400

        if not is_file_size_okay(file):
            return {"error": "File too large. Maximum 5MB allowed."}, 400

        result = cloudinary.uploader.upload(
            file,
            transformation=[
                {
                    "width": 800,
                    "crop": "limit",
                    "quality": "auto",
                    "fetch_format": "auto"
                }
            ]
        )
        return {"url": result['secure_url']}, 200
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return {"error": "Failed to upload image."}, 500

