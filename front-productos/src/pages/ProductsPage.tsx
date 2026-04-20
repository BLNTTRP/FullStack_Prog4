import { useState, useEffect, useCallback } from 'react';
import ProductoList from '../components/ProductoList';
import ProductoModal from '../components/ProductoModal';
import type { Producto, NuevoProducto } from '../types/producto';
import type { Categoria } from '../types/categoria';
import type { Ingrediente } from '../types/ingrediente';

const API_BASE_URL = 'http://localhost:8000/api';

export default function ProductsPage() {
    const [productos, setProductos] = useState<Producto[]>([]);
    // Estados para las listas de opciones del modal
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const [prodRes, catRes, ingRes] = await Promise.all([
                fetch(`${API_BASE_URL}/productos/`),
                fetch(`${API_BASE_URL}/categorias/`),
                fetch(`${API_BASE_URL}/ingredientes/`)
            ]);

            if (prodRes.ok) setProductos(await prodRes.json());
            if (catRes.ok) setCategorias(await catRes.json());
            if (ingRes.ok) setIngredientes(await ingRes.json());
        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreate = async (nuevoProducto: NuevoProducto) => {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProducto),
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error('Error al crear:', error);
        }
    };

    const handleUpdate = async (id: number, productoActualizado: NuevoProducto) => {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productoActualizado),
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error('Error al actualizar:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/productos/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setProductos(productos.filter(prod => prod.id !== id));
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    const openCreateModal = () => {
        setProductoAEditar(null);
        setIsModalOpen(true);
    };

    const openEditModal = (producto: Producto) => {
        setProductoAEditar(producto);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (datos: NuevoProducto, id?: number) => {
        if (id !== undefined) {
            handleUpdate(id, datos);
        } else {
            handleCreate(datos);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Productos</h2>
                <button
                    onClick={openCreateModal}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 shadow-sm transition-colors"
                >
                    + Nuevo Producto
                </button>
            </div>

            <ProductoList
                productos={productos}
                onEdit={openEditModal}
                onDelete={handleDelete}
            />

            {/* Si isModalOpen es true, el modal se monta desde cero. Si es false, se destruye */}
            {isModalOpen && (
                <ProductoModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    productoAEditar={productoAEditar}
                    categoriasDisponibles={categorias}
                    ingredientesDisponibles={ingredientes}
                />
            )}
        </div>
    );
}