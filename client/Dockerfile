# Using an official node js runtime as a parent image
FROM node:lts

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Installing node js server dependencies
RUN npm ci 

# Cleaning leftover cache in the dependency installer
RUN npm cache clean --force

# Copying the rest of the application code to the docker volume
COPY . .

# generating prisma folders
# RUN npx prisma generate

# Giving elevated execution permissions to ngrok file that deals with domain creation
RUN chmod +x /usr/src/app/ngrok/ngrok

# Giving elevated execution permission to bash script that deals with the domain creation process
RUN chmod +x /usr/src/app/ngrok/start-ngrok.sh

# Executing the ngrok user authtoken configuration through which the domain will be created
RUN ./ngrok/ngrok config add-authtoken 2aWhwpDZ79Nl1WHwWIBSM06dnAM_76UJkc6s633nmPPGkUcwF

# Installing necessary dependencies for the bash script file 
RUN apt-get update && apt-get install -y bash netcat-openbsd 

# Starting the Execution of two commands parallelly one deals with the server and the other handles ngrok domain creation for the server
# CMD ["sh", "-c", "node build/index.js & ./ngrok/start-ngrok.sh"]
CMD ["sh", "-c", "npm run dev & ./ngrok/start-ngrok.sh"]