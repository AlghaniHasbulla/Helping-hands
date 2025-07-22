import cloudinary
import cloudinary.uploader
import os

# Setup Cloudinary configuration (usually from env variables)
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_image(image_file):
    """
    Uploads an image to Cloudinary and returns the secure URL.
    `image_file` should be a file-like object (e.g., from Flask's `request.files['avatar']`)
    """
    result = cloudinary.uploader.upload(image_file)
    return result.get("secure_url")
