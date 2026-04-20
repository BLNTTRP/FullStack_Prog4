import type {Categoria} from '../types/categoria';
import CategoriaCard from './CategoriaCard';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.map((cat) => (
                <CategoriaCard
                    key={cat.id}
                    categoria={cat}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}