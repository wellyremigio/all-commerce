import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';

import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import AdminDashboard from './pages/AdminDashboard';
import AdminPage from './pages/AdminPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminLogsPage from './pages/AdminLogsPage';

function App() {
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);

    const handleLogin = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const handleAddToCart = (productToAdd) => {
        setCartItems(currentItems => {
            const isItemInCart = currentItems.find(item => item.id === productToAdd.id);
            if (isItemInCart) {
                return currentItems.map(item =>
                    item.id === productToAdd.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...currentItems, { ...productToAdd, quantity: 1 }];
        });
    };

    const handleRemoveFromCart = (productToRemove) => {
        setCartItems(currentItems =>
            currentItems.flatMap(item => {
                if (item.id === productToRemove.id) {
                    return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
                }
                return [item];
            })
        );
    };

    const handleClearCart = () => setCartItems([]);

    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <ChakraProvider>
            <Router>
                <Box bg="gray.50" minH="100vh">
                    <Header
                        cartItemCount={cartItemCount}
                        isLoggedIn={!!user}
                        isAdmin={user && user.role === 'admin'}
                        onLogout={handleLogout}
                    />
                    <Box as="main" p={5}>
                        <Routes>
                            <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
                            <Route path="/produto/:id" element={<ProductDetailPage onAddToCart={handleAddToCart} />} />
                            <Route path="/cart" element={<CartPage cartItems={cartItems} onAddToCart={handleAddToCart} onRemoveFromCart={handleRemoveFromCart} onClearCart={handleClearCart} />} />
                            <Route path="/meus-pedidos" element={<OrderHistoryPage />} />
                            <Route path="/payment" element={<PaymentPage onClearCart={handleClearCart} />} />
                            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                            <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />

                            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                            <Route path="/admin/products" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
                            <Route path="/admin/products/add" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
                            <Route path="/admin/products/edit/:productId" element={<ProtectedRoute><EditProductPage /></ProtectedRoute>} />
                            <Route path="/admin/orders" element={<ProtectedRoute><AdminOrdersPage /></ProtectedRoute>} />
                            <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
                            <Route path="/admin/logs" element={<ProtectedRoute><AdminLogsPage /></ProtectedRoute>} />
                        </Routes>
                    </Box>
                </Box>
            </Router>
        </ChakraProvider>
    );
}

export default App;