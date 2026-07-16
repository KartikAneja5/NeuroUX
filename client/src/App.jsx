import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-[#080712] text-white font-sans">
            <Navbar />
            <main className="flex-grow">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
