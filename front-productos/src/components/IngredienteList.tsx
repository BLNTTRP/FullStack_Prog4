import type { Ingrediente } from '../types/ingrediente';

interface Props {
    ingredientes: Ingrediente[];
    onEdit: (ingrediente: Ingrediente) => void;
    onDelete: (id: number) => void;
}

export default function IngredienteList({ ingredientes, onEdit, onDelete }: Props) {
    if (ingredientes.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No hay ingredientes registrados. Crea uno nuevo
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alérgeno</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {ingredientes.map((ing) => (
                        <tr key={ing.id} className="group hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {ing.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {ing.nombre}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {ing.es_alergeno ? (
                                    <span className="text-red-600 bg-red-100 px-2 py-1 rounded-md text-xs font-bold">⚠️ Sí</span>
                                ) : (
                                    <span className="text-gray-500">No</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onEdit(ing)}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onDelete(ing.id)}
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