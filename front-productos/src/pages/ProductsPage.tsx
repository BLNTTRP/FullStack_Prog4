import { useState } from 'react';
import ProductoList from '../components/ProductoList';
import ProductoModal from '../components/ProductoModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Producto, NuevoProducto } from '../types/producto';
import type { Categoria } from '../types/categoria';
import type { Ingrediente } from '../types/ingrediente';

const API_BASE_URL = 'http://localhost:8000/api';

export default function ProductsPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);

    // Queries para obtener Productos, Categorías e Ingredientes
    const { data: productos = [], isLoading: loadingProductos, isError: errorProductos } = useQuery<Producto[]>({
        queryKey: ['productos'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/productos/`);
            if (!res.ok) throw new Error('Error al cargar productos');
            return res.json();
        }
    });

    const { data: categorias = [] } = useQuery<Categoria[]>({
        queryKey: ['categorias'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/categorias/`);
            if (!res.ok) throw new Error('Error al cargar categorias');
            return res.json();
        }
    });

    const { data: ingredientes = [] } = useQuery<Ingrediente[]>({
        queryKey: ['ingredientes'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/ingredientes/`);
            if (!res.ok) throw new Error('Error al cargar ingredientes');
            return res.json();
        }
    });

    // Mutaciones
    const createMutation = useMutation({
        mutationFn: async (nuevoProducto: NuevoProducto) => {
            const response = await fetch(`${API_BASE_URL}/productos/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProducto),
            });
            if (!response.ok) throw new Error('Error al crear producto');
            return response.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] })
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, datos }: { id: number; datos: NuevoProducto }) => {
            const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos),
            });
            if (!response.ok) throw new Error('Error al actualizar producto');
            return response.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] })
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${API_BASE_URL}/productos/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar producto');
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] })
    });


    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
        deleteMutation.mutate(id);
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
            updateMutation.mutate({ id, datos });
        } else {
            createMutation.mutate(datos);
        }
        setIsModalOpen(false);
    };

    if (loadingProductos) return <div className="p-8 text-center">Cargando productos...</div>;
    if (errorProductos) return <div className="p-8 text-center text-red-500">Error al cargar los productos</div>;

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