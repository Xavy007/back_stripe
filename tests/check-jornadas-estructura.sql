-- Verificar estructura de la tabla Jornadas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Jornadas'
ORDER BY ordinal_position;

-- Ver si hay datos en Jornadas
SELECT * FROM "Jornadas" LIMIT 5;

-- Ver si hay partidos guardados
SELECT
  p.id_partido,
  p.id_campeonato,
  p.id_cc,
  p.equipo_local,
  p.equipo_visitante,
  p.id_jornada,
  p.fecha_hora,
  p.p_estado
FROM "Partidos" p
WHERE p.id_campeonato = 1
LIMIT 10;
