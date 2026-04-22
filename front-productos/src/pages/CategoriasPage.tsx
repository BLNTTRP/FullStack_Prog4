import { useState } from 'react';
import CategoriaList from '../components/CategoriaList';
import CategoriaModal from '../components/CategoriaModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Categoria, NuevaCategoria } from '../types/categoria';

const API_URL = 'http://localhost:8000/api/categorias';

export default function CategoriasPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoriaAEditar, setCategoriaAEditar] = useState<Categoria | null>(null);

    const { data: categorias = [], isLoading, isError } = useQuery<Categoria[]>({
        queryKey: ['categorias'],
        queryFn: async () => {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al cargar las categorías');
            return response.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (nuevaCategoria: NuevaCategoria) => {
            const response = await fetch(`${API_URL}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaCategoria),
            });
            if (!response.ok) throw new Error('Error al crear');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (categoriaActualizada: Categoria) => {
            const response = await fetch(`${API_URL}/${categoriaActualizada.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: categoriaActualizada.nombre,
                    descripcion: categoriaActualizada.descripcion
                }),
            });
            if (!response.ok) throw new Error('Error al actualizar');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
        }
    });


    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;
        deleteMutation.mutate(id);
    };


    const openCreateModal = () => {
        setCategoriaAEditar(null);
        setIsModalOpen(true);
    };

    const openEditModal = (categoria: Categoria) => {
        setCategoriaAEditar(categoria);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (datos: Categoria | NuevaCategoria) => {
        if ('id' in datos) {
            updateMutation.mutate(datos as Categoria);
        } else {
            createMutation.mutate(datos as NuevaCategoria);
        }
        setIsModalOpen(false);
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
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                categoriaAEditar={categoriaAEditar}
            />
        </div>
    );
}