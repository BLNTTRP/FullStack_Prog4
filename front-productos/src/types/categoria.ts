/**
 * Interface principal que representa una Categoría tal como
 * viene desde el backend (FastAPI).
 */
export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
}

/**
 * Interface auxiliar para crear una nueva categoría.
 */
export type NuevaCategoria = Omit<Categoria, 'id'>;