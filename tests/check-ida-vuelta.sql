-- Script para verificar los valores de ida_vuelta en la base de datos
-- Ejecutar en pgAdmin o con psql

-- Ver todas las categorías de campeonatos con su configuración
SELECT
    cc.id_cc,
    cc.id_campeonato,
    cc.id_categoria,
    c.nombre AS nombre_categoria,
    cc.formato,
    cc.ida_vuelta,
    cc.dias_entre_jornadas,
    cc.hora_inicio_partidos,
    cc.dias_juego,
    cc.numero_grupos,
    cc.estado
FROM "CampeonatoCategorias" cc
LEFT JOIN "Categorias" c ON c.id_categoria = cc.id_categoria
WHERE cc.estado = true
ORDER BY cc.id_cc DESC
LIMIT 10;

-- Ver un resumen de cuántas tienen ida_vuelta = true vs false
SELECT
    ida_vuelta,
    COUNT(*) as total
FROM "CampeonatoCategorias"
WHERE estado = true
GROUP BY ida_vuelta;
