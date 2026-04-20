import type { Ingrediente } from '../types/ingrediente';

interface IngredienteListProps {
    ingredientes: Ingrediente[];
    onEdit: (ingrediente: Ingrediente) => void;
    onDelete: (id: number) => void;
}

export default function IngredienteList({ ingredientes, onEdit, onDelete }: IngredienteListProps) {
    if (ingredientes.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-500 text-lg">No hay ingredientes registrados.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ingredientes.map((ing) => (
                <div key={ing.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="mb-4">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-800 break-words pr-2">{ing.nombre}</h3>
                            {ing.es_alergeno && (
                                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full flex-shrink-0" title="Alérgeno">
                                    ⚠️
                                </span>
                            )}
                        </div>
                        {ing.es_alergeno && <p className="text-xs text-red-500 mt-1">Contiene alérgenos</p>}
                    </div>

                    <div className="flex space-x-2 border-t border-gray-100 pt-3">
                        <button
                            onClick={() => onEdit(ing)}
                            className="flex-1 px-2 py-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors text-sm font-medium"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => onDelete(ing.id)}
                            className="flex-1 px-2 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}