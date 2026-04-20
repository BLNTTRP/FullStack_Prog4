import { useState, useEffect } from 'react';
import type {Categoria, NuevaCategoria} from '../types/categoria';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    // Puede enviar una Categoria completa (edición) o una NuevaCategoria (alta)
    onSubmit: (categoria: Categoria | NuevaCategoria) => void;
    categoriaAEditar?: Categoria | null;
}

export default function CategoriaModal({ isOpen, onClose, onSubmit, categoriaAEditar }: Props) {
    // Estados para controlar los inputs del formulario
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');

    useEffect(() => {
        if (categoriaAEditar) {
            setNombre(categoriaAEditar.nombre);
            setDescripcion(categoriaAEditar.descripcion);
        } else {
            // Limpiamos el formulario si es una nueva categoría
            setNombre('');
            setDescripcion('');
        }
    }, [categoriaAEditar, isOpen]);

    // Si el modal no está abierto, no renderizamos nada
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Evita que la página se recargue

        if (categoriaAEditar) {
            // Modo Edición: enviamos con el ID original
            onSubmit({ id: categoriaAEditar.id, nombre, descripcion });
        } else {
            // Modo Alta: enviamos sin ID
            onSubmit({ nombre, descripcion });
        }

        onClose(); // Cerramos el modal tras guardar
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    {categoriaAEditar ? 'Editar Categoría' : 'Nueva Categoría'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                            Nombre
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Electrónica"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
                            Descripción
                        </label>
                        <textarea
                            id="descripcion"
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Breve descripción de la categoría..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}