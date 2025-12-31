FROM node:24-alpine

WORKDIR /app

# On copie d'abord les fichiers de dépendances pour profiter du cache Docker
COPY package*.json ./
RUN npm install

# Copie du reste du projet
COPY . .

# Mode développement avec polling pour que ça détecte bien les changements de fichiers
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
