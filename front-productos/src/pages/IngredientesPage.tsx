import { useState, useEffect, useCallback } from 'react';
import IngredienteList from '../components/IngredienteList';
import IngredienteModal from '../components/IngredienteModal';
import type { Ingrediente, NuevoIngrediente } from '../types/ingrediente';

const API_URL = 'http://localhost:8000/api/ingredientes';

export default function IngredientesPage() {
    const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ingredienteAEditar, setIngredienteAEditar] = useState<Ingrediente | null>(null);

    const fetchIngredientes = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/`);
            if (!response.ok) throw new Error('Error al cargar ingredientes');
            const data = await response.json();
            setIngredientes(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchIngredientes();
    }, [fetchIngredientes]);

    const handleCreate = async (nuevoIngrediente: NuevoIngrediente) => {
        try {
            const response = await fetch(`${API_URL}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoIngrediente),
            });
            if (response.ok) fetchIngredientes();
        } catch (error) {
            console.error('Error al crear:', error);
        }
    };

    const handleUpdate = async (id: number, ingredienteActualizado: NuevoIngrediente) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ingredienteActualizado),
            });
            if (response.ok) fetchIngredientes();
        } catch (error) {
            console.error('Error al actualizar:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este ingrediente?')) return;
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setIngredientes(ingredientes.filter(ing => ing.id !== id));
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    const openCreateModal = () => {
        setIngredienteAEditar(null);
        setIsModalOpen(true);
    };

    const openEditModal = (ingrediente: Ingrediente) => {
        setIngredienteAEditar(ingrediente);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (datos: NuevoIngrediente, id?: number) => {
        if (id !== undefined) handleUpdate(id, datos);
        else handleCreate(datos);
    };

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