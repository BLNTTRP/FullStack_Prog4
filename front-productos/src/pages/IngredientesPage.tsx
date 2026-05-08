import { useState, useEffect } from 'react';
import IngredienteList from '../components/IngredienteList';
import IngredienteModal from '../components/IngredienteModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import type { Ingrediente, NuevoIngrediente } from '../types/ingrediente';
import { getIngredientes, createIngrediente, updateIngrediente, deleteIngrediente } from '../api/ingredientes.api';

export default function IngredientesPage() {
    const { id: urlId } = useParams();
    const queryClient = useQueryClient();

    // Estado unificado para evitar doble setState en el useEffect
    const [modalState, setModalState] = useState<{ isOpen: boolean; ingredienteAEditar: Ingrediente | null }>({
        isOpen: false,
        ingredienteAEditar: null,
    });

    const { data: ingredientes = [], isLoading, isError } = useQuery<Ingrediente[]>({
        queryKey: ['ingredientes'],
        queryFn: getIngredientes,
    });

    const createMutation = useMutation({
        mutationFn: (nuevoIngrediente: NuevoIngrediente) => createIngrediente(nuevoIngrediente),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, datos }: { id: number; datos: NuevoIngrediente }) => updateIngrediente(id, datos),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteIngrediente(id),
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
                setModalState({ isOpen: true, ingredienteAEditar: ingredienteEncontrado });
            }
        }
    }, [urlId, ingredientes]);

    const openCreateModal = () => {
        setModalState({ isOpen: true, ingredienteAEditar: null });
    };

    const openEditModal = (ingrediente: Ingrediente) => {
        setModalState({ isOpen: true, ingredienteAEditar: ingrediente });
    };

    const handleModalSubmit = (datos: NuevoIngrediente, id?: number) => {
        if (id !== undefined) {
            updateMutation.mutate({ id, datos });
        } else {
            createMutation.mutate(datos);
        }
        setModalState({ isOpen: false, ingredienteAEditar: null });
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

            {modalState.isOpen && (
                <IngredienteModal
                    onClose={() => setModalState({ isOpen: false, ingredienteAEditar: null })}
                    onSubmit={handleModalSubmit}
                    ingredienteAEditar={modalState.ingredienteAEditar}
                />
            )}
        </div>
    );
}