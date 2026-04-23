import type {Categoria} from '../types/categoria';

interface Props {
    categorias: Categoria[];
    onEdit: (categoria: Categoria) => void;
    onDelete: (id: number) => void;
}

export default function CategoriaList({ categorias, onEdit, onDelete }: Props) {
    if (categorias.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No hay categorías registradas. Crea una nueva
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {categorias.map((cat) => (
                        <tr key={cat.id} className="group hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {cat.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {cat.nombre}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {cat.descripcion || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onEdit(cat)}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onDelete(cat.id)}
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