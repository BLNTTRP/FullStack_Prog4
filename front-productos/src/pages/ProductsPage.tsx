import { useState, useEffect } from 'react';
import ProductoList from '../components/ProductoList';
import ProductoModal from '../components/ProductoModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import type { Producto, NuevoProducto } from '../types/producto';
import type { Categoria } from '../types/categoria';
import type { Ingrediente } from '../types/ingrediente';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../api/productos.api';
import { getCategorias } from '../api/categorias.api';
import { getIngredientes } from '../api/ingredientes.api';

export default function ProductsPage() {
    const { id: urlId } = useParams();
    const queryClient = useQueryClient();

    // Estado unificado para evitar doble setState en el useEffect
    const [modalState, setModalState] = useState<{ isOpen: boolean; productoAEditar: Producto | null }>({
        isOpen: false,
        productoAEditar: null,
    });

    // Queries para obtener Productos, Categorías e Ingredientes
    const { data: productos = [], isLoading: loadingProductos, isError: errorProductos } = useQuery<Producto[]>({
        queryKey: ['productos'],
        queryFn: getProductos,
    });

    const { data: categorias = [] } = useQuery<Categoria[]>({
        queryKey: ['categorias'],
        queryFn: getCategorias,
    });

    const { data: ingredientes = [] } = useQuery<Ingrediente[]>({
        queryKey: ['ingredientes'],
        queryFn: getIngredientes,
    });

    // Mutaciones
    const createMutation = useMutation({
        mutationFn: (nuevoProducto: NuevoProducto) => createProducto(nuevoProducto),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, datos }: { id: number; datos: NuevoProducto }) => updateProducto(id, datos),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] })
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteProducto(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] })
    });


    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
        deleteMutation.mutate(id);
    };

    // Efecto para abrir el modal si la URL incluye un ID válido
    useEffect(() => {
        if (urlId && productos.length > 0 && categorias.length > 0 && ingredientes.length > 0) {
            const productoEncontrado = productos.find(p => p.id === Number(urlId));
            if (productoEncontrado) {
                setModalState({ isOpen: true, productoAEditar: productoEncontrado });
            }
        }
    }, [urlId, productos, categorias, ingredientes]);

    const openCreateModal = () => {
        setModalState({ isOpen: true, productoAEditar: null });
    };

    const openEditModal = (producto: Producto) => {
        setModalState({ isOpen: true, productoAEditar: producto });
    };

    const handleModalSubmit = (datos: NuevoProducto, id?: number) => {
        if (id !== undefined) {
            updateMutation.mutate({ id, datos });
        } else {
            createMutation.mutate(datos);
        }
        setModalState({ isOpen: false, productoAEditar: null });
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
            {modalState.isOpen && (
                <ProductoModal
                    isOpen={modalState.isOpen}
                    onClose={() => setModalState({ isOpen: false, productoAEditar: null })}
                    onSubmit={handleModalSubmit}
                    productoAEditar={modalState.productoAEditar}
                    categoriasDisponibles={categorias}
                    ingredientesDisponibles={ingredientes}
                />
            )}
        </div>
    );
}