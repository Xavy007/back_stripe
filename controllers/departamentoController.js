// controllers/departamentoController.js
const service = require('../services/departamentoService');

const getDepartamentos = async (req, res) => {
    try {
        const data = await service.listarDepartamentos();
        res.json({ success: true, data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

const getDepartamento = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await service.obtenerDepartamento(id);
        res.json({ success: true, data });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};

const postDepartamento = async (req, res) => {
    try {
        const data = await service.crearDepartamento(req.body);
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

const putDepartamento = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await service.actualizarDepartamento(id, req.body);
        res.json({ success: true, data });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};

const deleteDepartamento = async (req, res) => {
    try {
        const id = req.params.id;
        await service.eliminarDepartamento(id);
        res.json({ success: true, message: 'Departamento eliminado' });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};

module.exports = {
    getDepartamentos,
    getDepartamento,
    postDepartamento,
    putDepartamento,
    deleteDepartamento
};
