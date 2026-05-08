import type { Ingrediente, NuevoIngrediente } from '../types/ingrediente';

const API_URL = 'http://localhost:8000/api/ingredientes';

export async function getIngredientes(): Promise<Ingrediente[]> {
    const response = await fetch(`${API_URL}/`);
    if (!response.ok) throw new Error('Error al cargar los ingredientes');
    return response.json();
}

export async function createIngrediente(nuevoIngrediente: NuevoIngrediente): Promise<Ingrediente> {
    const response = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoIngrediente),
    });
    if (!response.ok) throw new Error('Error al crear el ingrediente');
    return response.json();
}

export async function updateIngrediente(id: number, datos: NuevoIngrediente): Promise<Ingrediente> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al actualizar el ingrediente');
    return response.json();
}

export async function deleteIngrediente(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar el ingrediente');
}