import { useState, useEffect } from 'react';
import IngredienteList from '../components/IngredienteList';
import IngredienteModal from '../components/IngredienteModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import type { Ingrediente, NuevoIngrediente } from '../types/ingrediente';

const API_URL = 'http://localhost:8000/api/ingredientes';

export default function IngredientesPage() {
    const { id: urlId } = useParams();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ingredienteAEditar, setIngredienteAEditar] = useState<Ingrediente | null>(null);

    const { data: ingredientes = [], isLoading, isError } = useQuery<Ingrediente[]>({
        queryKey: ['ingredientes'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/`);
            if (!response.ok) throw new Error('Error al cargar ingredientes');
            return response.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (nuevoIngrediente: NuevoIngrediente) => {
            const response = await fetch(`${API_URL}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoIngrediente),
            });
            if (!response.ok) throw new Error('Error al crear ingrediente');
            return response.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, datos }: { id: number; datos: NuevoIngrediente }) => {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos),
            });
            if (!response.ok) throw new Error('Error al actualizar ingrediente');
            return response.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar ingrediente');
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
    });


    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este ingrediente?')) return;
        deleteMutation.mutate(id);
    };

    // Efecto para abrir el modal si la URL incluye un ID válido
    useEffect(() => {
        if (urlId && ingredientes.length > 0) {
            const ingredienteEncontrado = ingredientes.find(i => i.id === Number(urlId));
            if (ingredienteEncontrado) {
                setIngredienteAEditar(ingredienteEncontrado);
                setIsModalOpen(true);
            }
        }
    }, [urlId, ingredientes]);

    const openCreateModal = () => {
        setIngredienteAEditar(null);
        setIsModalOpen(true);
    };

    const openEditModal = (ingrediente: Ingrediente) => {
        setIngredienteAEditar(ingrediente);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (datos: NuevoIngrediente, id?: number) => {
        if (id !== undefined) {
            updateMutation.mutate({ id, datos });
        } else {
            createMutation.mutate(datos);
        }
        setIsModalOpen(false);
    };

    if (isLoading) return <div className="p-8 text-center">Cargando ingredientes...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Error al cargar los ingredientes</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Ingredientes</h2>
                <button
                    onClick={openCreateModal}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 shadow-sm transition-colors"
                >
                    + Nuevo Ingrediente
                </button>
            </div>

            <IngredienteList
                ingredientes={ingredientes}
                onEdit={openEditModal}
                onDelete={handleDelete}
            />

            {isModalOpen && (
                <IngredienteModal
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    ingredienteAEditar={ingredienteAEditar}
                />
            )}
        </div>
    );
}