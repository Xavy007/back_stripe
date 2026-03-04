-- Verificar si las columnas id_fase y id_grupo son nullable en la tabla Jornadas

SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'Jornadas'
  AND column_name IN ('id_fase', 'id_grupo')
ORDER BY column_name;

-- También verificar constraints
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'Jornadas'
  AND kcu.column_name IN ('id_fase', 'id_grupo')
ORDER BY kcu.column_name;
