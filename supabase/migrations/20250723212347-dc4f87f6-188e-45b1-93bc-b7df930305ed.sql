-- Corrigir função com search_path seguro
CREATE OR REPLACE FUNCTION notify_equipment_usage()
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Esta função pode ser expandida para enviar notificações
  -- Por enquanto, apenas registra o evento
  RAISE NOTICE 'Equipamento % foi associado ao evento %', NEW.equipamento_id, NEW.evento_id;
  RETURN NEW;
END;
$$;