import ProductoCard from './ProductoCard';
import type { Producto } from '../types/producto';

interface ProductoListProps {
    productos: Producto[];
    onEdit: (producto: Producto) => void;
    onDelete: (id: number) => void;
}

export default function ProductoList({ productos, onEdit, onDelete }: ProductoListProps) {
    if (productos.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-500 text-lg">No hay productos registrados.</p>
                <p className="text-gray-400 text-sm mt-1">Haz clic en "Nuevo Producto" para comenzar.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((producto) => (
                <ProductoCard
                    key={producto.id}
                    producto={producto}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}