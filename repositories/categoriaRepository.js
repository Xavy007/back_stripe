const {Categoria} = require('../models') ;

const crearCategoria= async(data)=>{
    return await Categoria.create(data);
}
const obtenerCategorias= async()=>{
    return await Categoria.findAll({where:{estado:true}});
}
const obtenerCategoriaPorId= async(id_categoria)=>{
    try {
        return await Categoria.findByPk(id_categoria);
    } catch (error) {
        throw new Error('No existe la categoria');
    }
}
const actualizarCategoria= async(id_categoria,data)=>{
    const categoria= await Categoria.findByPk(id_categoria);
    if(!categoria){
        return null;
    }
    return await categoria.update(data);
}

const eliminarCategoria = async(id_categoria)=>{
    const categoria = await Categoria.findByPk(id_categoria);
    if(!categoria){
        return null;
    }
    return await categoria.update({ estado: false });
}
// BONUS: Obtener categorías por género
const obtenerCategoriasPorGenero = async (genero) => {
    return await Categoria.findAll({
        where: { 
            genero: genero,
            estado: true 
        }
    });
};

// BONUS: Obtener categorías por rango de edad
const obtenerCategoriasPorEdad = async (edad) => {
    return await Categoria.findAll({
        where: {
            estado: true
        }
    }).then(categorias => {
        return categorias.filter(cat => {
            const cumpleEdadInicio = edad >= cat.edad_inicio;
            const cumpleEdadLimite = cat.edad_limite === null || edad <= cat.edad_limite;
            return cumpleEdadInicio && cumpleEdadLimite;
        });
    });
};

module.exports={
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria,
    obtenerCategoriasPorEdad,
    obtenerCategoriasPorGenero
}