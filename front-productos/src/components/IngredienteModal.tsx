import { useState } from 'react';
import type { Ingrediente, NuevoIngrediente } from '../types/ingrediente';

interface IngredienteModalProps {
    onClose: () => void;
    onSubmit: (ingrediente: NuevoIngrediente, id?: number) => void;
    ingredienteAEditar: Ingrediente | null;
}

const estadoInicial: NuevoIngrediente = {
    nombre: '',
    es_alergeno: false
};

const inicializarEstado = (ing: Ingrediente | null): NuevoIngrediente => {
    if (ing) {
        return { nombre: ing.nombre, es_alergeno: ing.es_alergeno };
    }
    return estadoInicial;
};

export default function IngredienteModal({ onClose, onSubmit, ingredienteAEditar }: IngredienteModalProps) {
    const [formData, setFormData] = useState<NuevoIngrediente>(() => inicializarEstado(ingredienteAEditar));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (ingredienteAEditar) {
            onSubmit(formData, ingredienteAEditar.id);
        } else {
            onSubmit(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {ingredienteAEditar ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Ingrediente</label>
                        <input
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: Queso Cheddar"
                        />
                    </div>

                    <div className="flex items-center p-3 bg-red-50 rounded-md border border-red-100">
                        <input
                            type="checkbox"
                            id="alergeno"
                            checked={formData.es_alergeno}
                            onChange={(e) => setFormData({...formData, es_alergeno: e.target.checked})}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="alergeno" className="ml-2 block text-sm font-medium text-red-800">
                            Es un ingrediente alérgeno
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}