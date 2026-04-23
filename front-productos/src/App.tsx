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

                        {/* Rutas de las páginas con soporte opcional para ID */}
                        <Route path="/categorias/:id?" element={<CategoriasPage />} />
                        <Route path="/productos/:id?" element={<ProductsPage />} />
                        <Route path="/ingredientes/:id?" element={<IngredientesPage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;