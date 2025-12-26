FROM node:24-slim

# On installe openssl (indispensable pour Prisma) et curl pour les healthchecks
RUN apt-get update && apt-get install -y openssl libssl-dev curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# On copie d'abord les fichiers de dépendances pour profiter du cache Docker
COPY package*.json ./
RUN npm install

# Copie du reste du projet
COPY . .

# Génère le Prisma Client et les engines adaptés à l'environnement du container
RUN npx prisma generate

EXPOSE 3000

# Mode développement avec polling pour que ça détecte bien les changements de fichiers
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
