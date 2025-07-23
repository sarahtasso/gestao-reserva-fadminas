-- Primeiro, vamos limpar e recriar as políticas RLS com as permissões corretas

-- PERFIS: permitir que super_admin veja todos os perfis e gerencie usuários
DROP POLICY IF EXISTS "ler perfil próprio" ON public.perfis;
DROP POLICY IF EXISTS "inserir perfil próprio" ON public.perfis;

CREATE POLICY "usuários podem ver seu próprio perfil" ON public.perfis
FOR SELECT USING (id = auth.uid());

CREATE POLICY "super_admin pode ver todos os perfis" ON public.perfis  
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() AND tipo_usuario = 'super_admin'
  )
);

CREATE POLICY "usuários podem criar seu próprio perfil" ON public.perfis
FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "super_admin pode criar novos usuários" ON public.perfis
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() AND tipo_usuario = 'super_admin'
  )
);

CREATE POLICY "super_admin pode atualizar perfis" ON public.perfis
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() AND tipo_usuario = 'super_admin'
  )
);

-- LOCAIS: permitir que todos vejam, mas só admin_equipamento edite
DROP POLICY IF EXISTS "ler locais disponíveis" ON public.locais;

CREATE POLICY "todos podem ver locais disponíveis" ON public.locais
FOR SELECT USING (disponivel = true);

CREATE POLICY "admin_equipamento pode gerenciar locais" ON public.locais
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() AND tipo_usuario IN ('admin_equipamento', 'super_admin')
  )
);

-- EQUIPAMENTOS: atualizar políticas existentes
DROP POLICY IF EXISTS "ler equipamentos disponíveis" ON public.equipamentos;
DROP POLICY IF EXISTS "admin pode editar equipamentos" ON public.equipamentos;

CREATE POLICY "todos podem ver equipamentos disponíveis" ON public.equipamentos
FOR SELECT USING (disponivel = true AND em_manutencao = false);

CREATE POLICY "admin_equipamento pode gerenciar equipamentos" ON public.equipamentos
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() AND tipo_usuario IN ('admin_equipamento', 'super_admin')
  )
);

-- EVENTOS: atualizar políticas para permitir que usuários vejam e criem, super_admin aprove
DROP POLICY IF EXISTS "usuario pode criar eventos" ON public.eventos;
DROP POLICY IF EXISTS "super_admin pode aprovar eventos" ON public.eventos;

CREATE POLICY "todos podem ver eventos" ON public.eventos
FOR SELECT USING (true);

CREATE POLICY "usuários podem criar eventos" ON public.eventos
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() AND tipo_usuario IN ('usuario', 'admin_equipamento', 'super_admin')
  ) AND criado_por = auth.uid()
);

CREATE POLICY "super_admin pode gerenciar todos os eventos" ON public.eventos
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() AND tipo_usuario = 'super_admin'
  )
);

CREATE POLICY "usuários podem editar seus próprios eventos" ON public.eventos
FOR UPDATE USING (
  criado_por = auth.uid() AND 
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() AND tipo_usuario IN ('usuario', 'admin_equipamento', 'super_admin')
  )
);

-- EVENTOS_EQUIPAMENTOS: permitir inserção e leitura
DROP POLICY IF EXISTS "leitura geral" ON public.eventos_equipamentos;

CREATE POLICY "todos podem ver eventos_equipamentos" ON public.eventos_equipamentos
FOR SELECT USING (true);

CREATE POLICY "usuários podem associar equipamentos aos seus eventos" ON public.eventos_equipamentos
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.eventos e
    WHERE e.id = evento_id AND e.criado_por = auth.uid()
  )
);

CREATE POLICY "super_admin pode gerenciar eventos_equipamentos" ON public.eventos_equipamentos
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() AND tipo_usuario = 'super_admin'
  )
);

-- EVENTOS_RESPONSAVEIS: similar ao equipamentos
DROP POLICY IF EXISTS "leitura geral" ON public.eventos_responsaveis;

CREATE POLICY "todos podem ver eventos_responsaveis" ON public.eventos_responsaveis
FOR SELECT USING (true);

CREATE POLICY "usuários podem associar responsáveis aos seus eventos" ON public.eventos_responsaveis
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.eventos e
    WHERE e.id = evento_id AND e.criado_por = auth.uid()
  )
);

CREATE POLICY "super_admin pode gerenciar eventos_responsaveis" ON public.eventos_responsaveis
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() AND tipo_usuario = 'super_admin'
  )
);

-- FEEDBACKS: usuários podem dar feedback
DROP POLICY IF EXISTS "escrever feedback" ON public.feedbacks;

CREATE POLICY "todos podem ver feedbacks" ON public.feedbacks
FOR SELECT USING (true);

CREATE POLICY "usuários podem criar feedbacks" ON public.feedbacks
FOR INSERT WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "super_admin pode gerenciar feedbacks" ON public.feedbacks
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() AND tipo_usuario = 'super_admin'
  )
);

-- Função para notificar admin_equipamento sobre uso de equipamentos
CREATE OR REPLACE FUNCTION notify_equipment_usage()
RETURNS trigger AS $$
BEGIN
  -- Esta função pode ser expandida para enviar notificações
  -- Por enquanto, apenas registra o evento
  RAISE NOTICE 'Equipamento % foi associado ao evento %', NEW.equipamento_id, NEW.evento_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notificar quando equipamentos são usados
DROP TRIGGER IF EXISTS equipment_usage_notification ON public.eventos_equipamentos;
CREATE TRIGGER equipment_usage_notification
  AFTER INSERT ON public.eventos_equipamentos
  FOR EACH ROW EXECUTE FUNCTION notify_equipment_usage();