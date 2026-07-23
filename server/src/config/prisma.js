const { PrismaClient } = require('@prisma/client');

// Singleton pour éviter d'ouvrir trop de connexions en mode dev (hot reload)
const prisma = new PrismaClient();

module.exports = prisma;
