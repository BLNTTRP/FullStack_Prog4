import { useState, useEffect } from 'react';
import CategoriaList from '../components/CategoriaList';
import CategoriaModal from '../components/CategoriaModal';
import type { Categoria, NuevaCategoria } from '../types/categoria';

const API_URL = 'http://localhost:8000/api/categorias';

export default function CategoriasPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoriaAEditar, setCategoriaAEditar] = useState<Categoria | null>(null);

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al cargar las categorías');
            const data = await response.json();
            if (Array.isArray(data)) setCategorias(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (nuevaCategoria: NuevaCategoria) => {
        try {
            const response = await fetch(`${API_URL}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaCategoria),
            });
            if (response.ok) fetchCategorias();
        } catch (error) {
            console.error('Error al crear:', error);
        }
    };

    const handleUpdate = async (categoriaActualizada: Categoria) => {
        try {
            const response = await fetch(`${API_URL}/${categoriaActualizada.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: categoriaActualizada.nombre,
                    descripcion: categoriaActualizada.descripcion
                }),
            });
            if (response.ok) fetchCategorias();
        } catch (error) {
            console.error('Error al actualizar:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setCategorias(categorias.filter(cat => cat.id !== id));
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
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
        if ('id' in datos) handleUpdate(datos as Categoria);
        else handleCreate(datos as NuevaCategoria);
    };

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