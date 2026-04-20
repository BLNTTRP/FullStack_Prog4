import type {Categoria} from '../types/categoria';

interface Props {
    categoria: Categoria;
    onEdit: (categoria: Categoria) => void;
    onDelete: (id: number) => void;
}

export default function CategoriaCard({ categoria, onEdit, onDelete }: Props) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {categoria.nombre}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-3">
                {categoria.descripcion}
            </p>
            <div className="flex justify-end space-x-3 mt-4 border-t pt-4">
                <button
                    onClick={() => onEdit(categoria)}
                    className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 transition-colors"
                >
                    Editar
                </button>
                <button
                    onClick={() => onDelete(categoria.id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
}