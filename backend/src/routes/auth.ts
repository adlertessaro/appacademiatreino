import { FastifyInstance } from 'fastify';
import { supabase } from '../lib/supabase';

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const { cpf } = request.body as { cpf: string };
    const cleanedCpf = cpf.replace(/\D/g, '');

    // 1. Buscar o perfil do usuário pelo CPF
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, nome')
      .eq('cpf', cleanedCpf)
      .single();

    if (profileError || !profile) {
      return reply.status(404).send({ error: 'Usuário não encontrado' });
    }

    // 2. Buscar TODOS os vínculos deste usuário nas academias
    // Aqui garantimos a privacidade: buscamos apenas onde ele é membro
    const { data: vinculos, error: vinculosError } = await supabase
      .from('academia_membro')
      .select(`
        id,
        funcao,
        status,
        academia (
          id,
          nome,
          slug,
          cor_primaria:rede(cor_primaria),
          logo:rede(logo_url)
        )
      `)
      .eq('usuario_cpf', cleanedCpf)
      .eq('status', 'ativo'); // Só entra se estiver com a mensalidade/vínculo em dia

    if (vinculosError || !vinculos || vinculos.length === 0) {
      return reply.status(403).send({ error: 'Você não possui vínculos ativos em nenhuma academia' });
    }

    // LÓGICA DE SELEÇÃO:
    if (vinculos.length > 1) {
      // Caso tenha mais de um, enviamos a lista para o Frontend mostrar a tela de escolha
      return {
        multipleUnits: true,
        units: vinculos,
        profile
      };
    }

    // Caso tenha apenas um, já retornamos os dados da academia ativa
    return {
      multipleUnits: false,
      unit: vinculos[0],
      profile
    };
  });
}