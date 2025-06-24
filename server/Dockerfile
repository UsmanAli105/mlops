# Use an official Python base image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Upgrade pip to version 22
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0

RUN pip install --upgrade pip==22.*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire app directory
COPY . .

# Expose the port FastAPI runs on
EXPOSE 8000

# Set environment variables (optional)
ENV PYTHONUNBUFFERED=1

# Run the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

