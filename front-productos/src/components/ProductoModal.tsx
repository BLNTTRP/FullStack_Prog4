import { useState } from 'react';
import type { Producto, NuevoProducto } from '../types/producto';
import type { Categoria } from '../types/categoria';
import type { Ingrediente } from '../types/ingrediente';

interface ProductoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (producto: NuevoProducto, id?: number) => void;
    productoAEditar: Producto | null;
    categoriasDisponibles: Categoria[];
    ingredientesDisponibles: Ingrediente[];
}

const estadoInicial: NuevoProducto = {
    nombre: '',
    descripcion: '',
    precio_base: 0,
    disponible: true,
    stock_cantidad: 0,
    categorias: [],
    ingredientes: []
};

const inicializarEstado = (producto: Producto | null): NuevoProducto => {
    if (producto) {
        return {
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio_base: producto.precio_base,
            disponible: producto.disponible,
            stock_cantidad: producto.stock_cantidad,
            categorias: producto.categorias_asociadas.map(c => ({
                categoria_id: c.categoria.id,
                es_principal: c.es_principal
            })),
            ingredientes: producto.ingredientes_asociados.map(i => ({
                ingrediente_id: i.ingrediente.id,
                es_removible: i.es_removible
            }))
        };
    }
    return estadoInicial;
};

export default function ProductoModal({
    onClose,
    onSubmit,
    productoAEditar,
    categoriasDisponibles,
    ingredientesDisponibles
}: ProductoModalProps) {

    const [formData, setFormData] = useState<NuevoProducto>(() => inicializarEstado(productoAEditar));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                    type === 'number' ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const toggleCategoria = (categoriaId: number) => {
        setFormData(prev => {
            const existe = prev.categorias.find(c => c.categoria_id === categoriaId);
            if (existe) {
                return { ...prev, categorias: prev.categorias.filter(c => c.categoria_id !== categoriaId) };
            } else {
                return { ...prev, categorias: [...prev.categorias, { categoria_id: categoriaId, es_principal: false }] };
            }
        });
    };

    const toggleCategoriaPrincipal = (categoriaId: number, esPrincipal: boolean) => {
        setFormData(prev => ({
            ...prev,
            categorias: prev.categorias.map(c =>
                c.categoria_id === categoriaId ? { ...c, es_principal: esPrincipal } : c
            )
        }));
    };

    const toggleIngrediente = (ingredienteId: number) => {
        setFormData(prev => {
            const existe = prev.ingredientes.find(i => i.ingrediente_id === ingredienteId);
            if (existe) {
                return { ...prev, ingredientes: prev.ingredientes.filter(i => i.ingrediente_id !== ingredienteId) };
            } else {
                return { ...prev, ingredientes: [...prev.ingredientes, { ingrediente_id: ingredienteId, es_removible: true }] };
            }
        });
    };

    const toggleIngredienteRemovible = (ingredienteId: number, esRemovible: boolean) => {
         setFormData(prev => ({
            ...prev,
            ingredientes: prev.ingredientes.map(i =>
                i.ingrediente_id === ingredienteId ? { ...i, es_removible: esRemovible } : i
            )
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (productoAEditar) {
            onSubmit(formData, productoAEditar.id);
        } else {
            onSubmit(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            {/* Contenedor principal con max-height y display flex en columna */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">

                {/* Encabezado (Queda fijo arriba) */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {productoAEditar ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl leading-none">&times;</button>
                </div>

                {/* Contenido del formulario (Scrolleable internamente) */}
                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Base</label>
                                <input type="number" step="0.01" min="0" name="precio_base" value={formData.precio_base} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 h-20" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
                                <input type="number" name="stock_cantidad" value={formData.stock_cantidad} onChange={handleChange} min="0" required className="w-full border border-gray-300 rounded-md px-3 py-2" />
                            </div>
                            <div className="flex items-center mt-6">
                                <input type="checkbox" name="disponible" checked={formData.disponible} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                <label className="ml-2 text-sm text-gray-700">Producto Disponible (Visible en catálogo)</label>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Categorías</h3>
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                {categoriasDisponibles.map(cat => {
                                    const seleccionada = formData.categorias.find(c => c.categoria_id === cat.id);
                                    return (
                                        <div key={cat.id} className="flex items-center justify-between p-2 hover:bg-white rounded border border-transparent hover:border-gray-300">
                                            <div className="flex items-center">
                                                <input type="checkbox" checked={!!seleccionada} onChange={() => toggleCategoria(cat.id)} className="h-4 w-4 text-blue-600 rounded" />
                                                <span className="ml-2 text-sm">{cat.nombre}</span>
                                            </div>
                                            {seleccionada && (
                                                <label className="text-xs text-gray-600 flex items-center">
                                                    <input type="checkbox" checked={seleccionada.es_principal} onChange={(e) => toggleCategoriaPrincipal(cat.id, e.target.checked)} className="mr-1 h-3 w-3" />
                                                    Principal
                                                </label>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Ingredientes</h3>
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                 {ingredientesDisponibles.map(ing => {
                                    const seleccionado = formData.ingredientes.find(i => i.ingrediente_id === ing.id);
                                    return (
                                        <div key={ing.id} className="flex items-center justify-between p-2 hover:bg-white rounded border border-transparent hover:border-gray-300">
                                            <div className="flex items-center">
                                                <input type="checkbox" checked={!!seleccionado} onChange={() => toggleIngrediente(ing.id)} className="h-4 w-4 text-blue-600 rounded" />
                                                <span className="ml-2 text-sm">{ing.nombre} {ing.es_alergeno && <span className="text-red-500 font-bold ml-1" title="Alérgeno">⚠️</span>}</span>
                                            </div>
                                            {seleccionado && (
                                                <label className="text-xs text-gray-600 flex items-center">
                                                    <input type="checkbox" checked={seleccionado.es_removible} onChange={(e) => toggleIngredienteRemovible(ing.id, e.target.checked)} className="mr-1 h-3 w-3" />
                                                    Removible
                                                </label>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Botones guardado al final del scroll */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200">Cancelar</button>
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">Guardar Producto</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}