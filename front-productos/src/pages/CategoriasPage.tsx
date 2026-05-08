import { useState, useEffect } from 'react';
import CategoriaList from '../components/CategoriaList';
import CategoriaModal from '../components/CategoriaModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import type { Categoria, NuevaCategoria } from '../types/categoria';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../api/categorias.api';

export default function CategoriasPage() {
    const { id: urlId } = useParams();
    const queryClient = useQueryClient();

    // Estado unificado para evitar doble setState en el useEffect
    const [modalState, setModalState] = useState<{ isOpen: boolean; categoriaAEditar: Categoria | null }>({
        isOpen: false,
        categoriaAEditar: null,
    });

    const { data: categorias = [], isLoading, isError } = useQuery<Categoria[]>({
        queryKey: ['categorias'],
        queryFn: getCategorias,
    });

    const createMutation = useMutation({
        mutationFn: (nuevaCategoria: NuevaCategoria) => createCategoria(nuevaCategoria),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: (categoriaActualizada: Categoria) => updateCategoria(categoriaActualizada),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCategoria(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
        }
    });


    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;
        deleteMutation.mutate(id);
    };

    // Efecto para abrir el modal si la URL incluye un ID válido
    useEffect(() => {
        if (urlId && categorias.length > 0) {
            const categoriaEncontrada = categorias.find(c => c.id === Number(urlId));
            if (categoriaEncontrada) {
                setModalState({ isOpen: true, categoriaAEditar: categoriaEncontrada });
            }
        }
    }, [urlId, categorias]);

    const openCreateModal = () => {
        setModalState({ isOpen: true, categoriaAEditar: null });
    };

    const openEditModal = (categoria: Categoria) => {
        setModalState({ isOpen: true, categoriaAEditar: categoria });
    };

    const handleModalSubmit = (datos: Categoria | NuevaCategoria) => {
        if ('id' in datos) {
            updateMutation.mutate(datos as Categoria);
        } else {
            createMutation.mutate(datos as NuevaCategoria);
        }
        setModalState({ isOpen: false, categoriaAEditar: null });
    };

    if (isLoading) return <div className="p-8 text-center">Cargando categorías...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Error al cargar las categorías</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Categorías</h2>
                <button
                    onClick={openCreateModal}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 shadow-sm transition-colors"
                >
                    + Nueva Categoría
                </button>
            </div>

            <CategoriaList
                categorias={categorias}
                onEdit={openEditModal}
                onDelete={handleDelete}
            />

            <CategoriaModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, categoriaAEditar: null })}
                onSubmit={handleModalSubmit}
                categoriaAEditar={modalState.categoriaAEditar}
            />
        </div>
    );
}