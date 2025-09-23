import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link as RouterLink } from 'react-router-dom';
import { ChakraProvider, Box, Flex, Heading, Link, Badge } from '@chakra-ui/react';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage'; 
import AddProductPage from './pages/AddProductPage'; 
import EditProductPage from './pages/EditProductPage';
import PaymentPage from './pages/PaymentPage';

function App() {
  const [cartItems, setCartItems] = useState([]);

  // ... (suas funções handleAddToCart, etc. continuam aqui)
const handleAddToCart = (productToAdd) => {
    setCartItems(currentItems => {
      // Verifica se o produto já está no carrinho
      const isItemInCart = currentItems.find(item => item.id === productToAdd.id);

      if (isItemInCart) {
        // Se estiver, atualiza a quantidade
        return currentItems.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Se não estiver, adiciona com quantidade 1
        return [...currentItems, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (productToRemove) => {
    setCartItems(currentItems =>
      currentItems.flatMap(item => {
        if (item.id === productToRemove.id) {
          // Se a quantidade for maior que 1, apenas diminui
          if (item.quantity > 1) {
            return [{ ...item, quantity: item.quantity - 1 }];
          }
          // Se for 1, remove o item completamente
          return [];
        }
        return [item];
      })
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };


  return (
    <ChakraProvider>
      <Router>
        <Box>
          <Flex
            as="header"
            align="center"
            justify="space-between"
            p={4}
            bg="gray.100"
            borderBottom="1px"
            borderColor="gray.200"
          >
            <Heading size="md">
              <Link as={RouterLink} to="/">All Commerce</Link>
            </Heading>
            <Flex align="center" gap={4}>
              <Link as={RouterLink} to="/cart" position="relative">
                Carrinho
                {cartItems.length > 0 && (
                  <Badge colorScheme="red" ml={1} borderRadius="full" px={2}>
                    {cartItems.length}
                  </Badge>
                )}
              </Link>
              {/* Link para a área de Admin */}
              <Link as={RouterLink} to="/admin" fontWeight="bold">
                Gerenciar Produtos
              </Link>
            </Flex>
          </Flex>

          <Box as="main" p={5}>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
              <Route
                path="/cart"
                element={<CartPage cartItems={cartItems} onAddToCart={handleAddToCart} onRemoveFromCart={handleRemoveFromCart} onClearCart={handleClearCart} />}
              />

              {/* Novas Rotas Administrativas */}
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/add" element={<AddProductPage />} />
              <Route path="/admin/edit/:productId" element={<EditProductPage />} />
              <Route path="/payment" element={<PaymentPage onClearCart={handleClearCart} />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;