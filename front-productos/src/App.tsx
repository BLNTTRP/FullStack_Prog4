import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CategoriasPage from './pages/CategoriasPage';
import ProductsPage from './pages/ProductsPage';
import IngredientesPage from './pages/IngredientesPage';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <main>
                    <Routes>
                        {/* Redirección: si entran a localhost:5173/ los manda a /categorias */}
                        <Route path="/" element={<Navigate to="/categorias" replace />} />

                        {/* Rutas de las páginas */}
                        <Route path="/categorias" element={<CategoriasPage />} />
                        <Route path="/productos" element={<ProductsPage />} />
                        <Route path="/ingredientes" element={<IngredientesPage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;