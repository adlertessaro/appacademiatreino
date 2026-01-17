import { FastifyInstance } from 'fastify';
import { supabase } from '../lib/supabase';

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const { cpf } = request.body as { cpf: string };
    const cleanedCpf = cpf.replace(/\D/g, '');

    // Buscar o perfil do usuário pelo CPF
  const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select(`
  id, 
  name:nome,
  weeklySchedule:treinos (
    id,
    dia_semana,
    foco,
    exercicios (
      nome,
      series_repeticoes
    )
  )
`)
  .eq('cpf', cleanedCpf)
  .single();

    if (profileError || !profile) {
      return reply.status(404).send({ error: 'Usuário não encontrado' });
    }

    // Buscar TODOS os vínculos deste usuário nas academias
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
      .eq('status', 'ATIVO'); // Só entra se estiver com a mensalidade/vínculo em dia

    if (vinculosError || !vinculos || vinculos.length === 0) {
      return reply.status(403).send({ error: 'Você não possui vínculos ativos em nenhuma academia' });
    }

    // busca os treinos
    const { data: treinos, error: treinosError } = await supabase 
    .from('treinos')
      .select(`
        id,
        perfil_id,
        academia_id,
        day:dia_semana,
        focus:foco,
        intensity:intensidade,
        groups:grupos_musculares,
        exercises:exercicios (
          name:nome,
          sets:series_repeticoes,
          justification:justificativa,
          technique:tecnica        
        )
      `)
      .eq('perfil_id', profile.id)

      if (profileError || !profile) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
      }

      //Busca os checkin
    const { data: checkIns, error: checkInsError } = await supabase
    .from('checkins')
    .select(`
      id,
      date:data_registro,
      weight:peso_registrado,
      dayIndex:day_index
    `)
    .eq('perfil_id', profile.id);

      if (checkInsError) {
        return reply.status(500).send({ error: 'Erro ao buscar check-ins' });
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

      return reply.send({
          user: {
          ...profile,
          weeklySchedule: treinos || [],
          checkIns: checkIns || []
        }
        });
  });
}