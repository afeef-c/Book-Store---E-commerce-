# books/custom_storage.py
from storages.backends.s3boto3 import S3Boto3Storage

class CustomS3Storage(S3Boto3Storage):
    """
    Custom S3 storage class to handle file uploads to S3
    """
    def __init__(self, *args, **kwargs):
        # You can add any custom logic or configuration here if needed
        super().__init__(*args, **kwargs)
