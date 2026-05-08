import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CategoriasPage from '../pages/CategoriasPage';
import ProductsPage from '../pages/ProductsPage';
import IngredientesPage from '../pages/IngredientesPage';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Navigate to="/categorias" replace />} />
                        <Route path="/categorias/:id?" element={<CategoriasPage />} />
                        <Route path="/productos/:id?" element={<ProductsPage />} />
                        <Route path="/ingredientes/:id?" element={<IngredientesPage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}