import type { Producto, NuevoProducto } from '../types/producto';

const API_BASE_URL = 'http://localhost:8000/api/productos';

export async function getProductos(): Promise<Producto[]> {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) throw new Error('Error al cargar los productos');
    return response.json();
}

export async function createProducto(nuevoProducto: NuevoProducto): Promise<Producto> {
    const response = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto),
    });
    if (!response.ok) throw new Error('Error al crear el producto');
    return response.json();
}

export async function updateProducto(id: number, datos: NuevoProducto): Promise<Producto> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al actualizar el producto');
    return response.json();
}

export async function deleteProducto(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar el producto');
}