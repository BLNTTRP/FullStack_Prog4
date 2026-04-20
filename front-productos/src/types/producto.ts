import type {Categoria} from './categoria';
import type {Ingrediente} from './ingrediente';

// Interfaces para leer datos (Respuestas del Back)
export interface ProductoCategoria {
    es_principal: boolean;
    categoria: Categoria;
}

export interface ProductoIngrediente {
    es_removible: boolean;
    ingrediente: Ingrediente;
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio_base: number;
    imagenes_url: string[];
    disponible: boolean;
    stock_cantidad: number;
    categorias_asociadas: ProductoCategoria[];
    ingredientes_asociados: ProductoIngrediente[];
}

// Interfaces para enviar datos (Crear/Editar en el Back)
export interface CategoriaAsignacion {
    categoria_id: number;
    es_principal: boolean;
}

export interface IngredienteAsignacion {
    ingrediente_id: number;
    es_removible: boolean;
}

export interface NuevoProducto {
    nombre: string;
    descripcion: string;
    precio_base: number;
    imagenes_url: string[];
    disponible: boolean;
    stock_cantidad: number;
    categorias: CategoriaAsignacion[];
    ingredientes: IngredienteAsignacion[];
}