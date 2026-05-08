import type { Categoria, NuevaCategoria } from '../types/categoria';

const API_URL = 'http://localhost:8000/api/categorias';

export async function getCategorias(): Promise<Categoria[]> {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar las categorias');
    return response.json();
}

export async function createCategoria(nuevaCategoria: NuevaCategoria): Promise<Categoria> {
    const response = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCategoria),
    });
    if (!response.ok) throw new Error('Error al crear la categoria');
    return response.json();
}

export async function updateCategoria(categoria: Categoria): Promise<Categoria> {
    const response = await fetch(`${API_URL}/${categoria.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: categoria.nombre, descripcion: categoria.descripcion }),
    });
    if (!response.ok) throw new Error('Error al actualizar la categoría');
    return response.json();
}

export async function deleteCategoria(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar la categoría');
}