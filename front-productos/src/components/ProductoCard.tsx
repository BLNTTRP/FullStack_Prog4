import type { Producto } from '../types/producto';

interface ProductoCardProps {
    producto: Producto;
    onEdit: (producto: Producto) => void;
    onDelete: (id: number) => void;
}

export default function ProductoCard({ producto, onEdit, onDelete }: ProductoCardProps) {
    // Tomamos la primera imagen si existe, si no, un placeholder
    const imagenUrl = producto.imagenes_url.length > 0
        ? producto.imagenes_url[0]
        : 'https://via.placeholder.com/300?text=Sin+Imagen';

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col">
            <img
                src={imagenUrl}
                alt={producto.nombre}
                className="w-full h-48 object-cover"
            />
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{producto.nombre}</h3>
                    <span className="text-lg font-bold text-green-600">${producto.precio_base.toFixed(2)}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{producto.descripcion}</p>

                {/* Badges de Categorías */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {producto.categorias_asociadas.map((cat_assoc) => (
                        <span
                            key={cat_assoc.categoria.id}
                            className={`text-xs px-2 py-1 rounded-full ${cat_assoc.es_principal ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-gray-100 text-gray-600'}`}
                        >
                            {cat_assoc.categoria.nombre} {cat_assoc.es_principal && '★'}
                        </span>
                    ))}
                </div>

                {/* Stock y Alérgenos */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className={`text-sm font-medium ${producto.stock_cantidad > 0 ? 'text-gray-600' : 'text-red-500'}`}>
                            Stock: {producto.stock_cantidad}
                        </span>
                        {/* Mostrar advertencia si hay algún alérgeno */}
                        {producto.ingredientes_asociados.some(ing => ing.ingrediente.es_alergeno) && (
                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-md">
                                ⚠️ Contiene Alérgenos
                            </span>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(producto)}
                            className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors font-medium text-sm"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => onDelete(producto.id)}
                            className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors font-medium text-sm"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}