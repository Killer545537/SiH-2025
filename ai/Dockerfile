# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the src directory into the container at /app
COPY ./src /app/src

# Command to run the application
# It tells uvicorn to run the 'app' instance from the 'src.main' module.
# --host 0.0.0.0 makes it accessible from outside the container.
# --port 80 is the standard HTTP port.
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "80"]
