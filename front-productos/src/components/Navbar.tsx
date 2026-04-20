import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    // Función auxiliar para cambiar estilos dependiendo de la ruta activa
    const isActive = (path: string) => {
        return location.pathname.startsWith(path)
            ? "bg-blue-700 text-white"
            : "text-blue-100 hover:bg-blue-500 hover:text-white";
    };

    return (
        <nav className="bg-blue-600 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-white text-2xl font-bold tracking-tight">
                                Catálogo
                            </h1>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link
                                    to="/categorias"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/categorias')}`}
                                >
                                    Categorías
                                </Link>
                                <Link
                                    to="/ingredientes"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/ingredientes')}`}
                                >
                                    Ingredientes
                                </Link>
                                <Link
                                    to="/productos"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/productos')}`}
                                >
                                    Productos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}