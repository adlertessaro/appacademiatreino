import fastify from 'fastify';
import cors from '@fastify/cors';
import { authRoutes } from './routes/auth';

const app = fastify({ logger: true });

app.register(cors, {
  origin: true || 'http://localhost:5173',
  methods: ['GET', 'POST'],
});


// Registra nossas rotas de autenticação
app.register(authRoutes);

app.listen({ port: 3333, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('🚀 Servidor da Academia rodando em http://localhost:3333');
});