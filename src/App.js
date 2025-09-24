import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';

// Componentes
import Header from './components/Header';

// Páginas
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import PaymentPage from './pages/PaymentPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
// 1. Importar a nova página de detalhes
import ProductDetailPage from './pages/ProductDetailPage';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (productToAdd) => {
    setCartItems(currentItems => {
      const isItemInCart = currentItems.find(item => item.id === productToAdd.id);
      if (isItemInCart) {
        return currentItems.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...currentItems, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (productToRemove) => {
    setCartItems(currentItems =>
      currentItems.flatMap(item => {
        if (item.id === productToRemove.id) {
          if (item.quantity > 1) {
            return [{ ...item, quantity: item.quantity - 1 }];
          }
          return [];
        }
        return [item];
      })
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // CORRIGIDO: Calcula a quantidade total de itens para o badge
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <ChakraProvider>
      <Router>
        <Box>
          <Header cartItemCount={cartItemCount} />

          <Box as="main" p={5}>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
              
              {/* 2. Adicionar a rota para a página de detalhes */}
              <Route path="/produto/:id" element={<ProductDetailPage onAddToCart={handleAddToCart} />} />
              
              <Route
                path="/cart"
                element={<CartPage cartItems={cartItems} onAddToCart={handleAddToCart} onRemoveFromCart={handleRemoveFromCart} onClearCart={handleClearCart} />}
              />
              <Route path="/meus-pedidos" element={<OrderHistoryPage />} />
              <Route path="/payment" element={<PaymentPage onClearCart={handleClearCart} />} />
              
              {/* Rotas de Admin */}
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/add" element={<AddProductPage />} />
              <Route path="/admin/edit/:productId" element={<EditProductPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;