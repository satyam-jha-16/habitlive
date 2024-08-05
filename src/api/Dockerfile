FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

EXPOSE 5000

ENV MONGO_URI=mongodb+srv://satyamjha1607:9XKbuZUOnaZRYeLW@cluster0.oi3yvs8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
ENV PORT=5000

CMD ["node", "dist/src/index.js"]