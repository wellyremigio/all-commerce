import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link as RouterLink } from 'react-router-dom';
import { ChakraProvider, Box, Flex, Heading, Link, Badge } from '@chakra-ui/react';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage'; 
import AddProductPage from './pages/AddProductPage'; 
import EditProductPage from './pages/EditProductPage';

function App() {
  const [cartItems, setCartItems] = useState([]);

  // ... (suas funções handleAddToCart, etc. continuam aqui)
  const handleAddToCart = (productToAdd) => {
    setCartItems(currentItems => [...currentItems, productToAdd]);
  };
  const handleRemoveFromCart = (productToRemove) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== productToRemove.id));
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
                element={<CartPage cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onClearCart={handleClearCart} />}
              />

              {/* Novas Rotas Administrativas */}
              <Route path="/admin" element={<AdminPage />} />
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