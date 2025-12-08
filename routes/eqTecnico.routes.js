const express = require('express');
const router = express.Router();
const eqTecnicoController = require('../controllers/eqTecnicoController');

router.post('/', eqTecnicoController.crearEqTecnico);
router.get('/', eqTecnicoController.listarEqTecnicos);
router.get('/todos', eqTecnicoController.listarTodosLosEqTecnicos);
router.get('/resumen', eqTecnicoController.obtenerResumenEqTecnico);
router.get('/vigentes', eqTecnicoController.listarEqTecnicosVigentes);
router.get('/club/:id_club', eqTecnicoController.listarEqTecnicosPorClub);
router.get('/persona/:id_persona', eqTecnicoController.listarEqTecnicosPorPersona);
router.get('/:id', eqTecnicoController.obtenerEqTecnicoPorId);
router.put('/:id', eqTecnicoController.actualizarEqTecnico);
router.patch('/:id/estado_eq', eqTecnicoController.actualizarEstadoEqTecnico);
router.delete('/:id', eqTecnicoController.eliminarEqTecnico);

module.exports = router;
