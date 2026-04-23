import type { Producto } from '../types/producto';

interface Props {
    productos: Producto[];
    onEdit: (producto: Producto) => void;
    onDelete: (id: number) => void;
}

export default function ProductoList({ productos, onEdit, onDelete }: Props) {
    if (productos.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No hay productos registrados. Crea uno nuevo
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Base</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {productos.map((prod) => (
                        <tr key={prod.id} className="group hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {prod.nombre}
                                {/* Pequeña alerta si tiene alérgenos */}
                                {prod.ingredientes_asociados?.some(ing => ing.ingrediente.es_alergeno) && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800" title="Contiene alérgenos">
                                        ⚠️
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                                ${prod.precio_base.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={prod.stock_cantidad > 0 ? "text-gray-900" : "text-red-500 font-bold"}>
                                    {prod.stock_cantidad}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {prod.disponible ? (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Disponible</span>
                                ) : (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Oculto</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onEdit(prod)}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onDelete(prod.id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}