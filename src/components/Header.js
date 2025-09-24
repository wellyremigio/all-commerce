// src/components/Header.js

import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Flex, HStack, Text, Icon, Badge, Button } from '@chakra-ui/react';
import { FiPackage, FiShoppingCart, FiSettings, FiLogIn, FiLogOut } from 'react-icons/fi';

const logoPath = '/assets/logo.png';

const NavLink = ({ to, icon, children }) => (
    <HStack as={RouterLink} to={to} spacing={2} align="center" color="gray.600" fontWeight="medium" _hover={{ color: 'blue.500', textDecoration: 'none' }} transition="color 0.2s">
        <Icon as={icon} w={5} h={5} />
        <Text display={{ base: 'none', md: 'block' }}>{children}</Text>
    </HStack>
);

const LogoutButton = ({ onLogout }) => {
    const navigate = useNavigate();
    const handleLogoutClick = () => {
        onLogout();
        navigate('/');
    };
    return (
        <Button onClick={handleLogoutClick} size="sm" variant="ghost" colorScheme="blue" leftIcon={<Icon as={FiLogOut} />}>
            <Text display={{ base: 'none', md: 'block' }}>Sair</Text>
        </Button>
    );
};

function Header({ cartItemCount, isLoggedIn, isAdmin, onLogout }) {
    return (
        <Flex as="header" justify="space-between" align="center" bg="white" px={{ base: 4, md: 8 }} h="75px" boxShadow="sm" borderBottom="1px solid" borderColor="gray.200">
            <HStack as={RouterLink} to="/" spacing={3} _hover={{ textDecoration: 'none' }}>
                <img src={logoPath} alt="Logo da All Commerce" style={{ height: '45px' }} />
                <Text fontSize="xl" fontWeight="bold" color="gray.800">All Commerce</Text>
            </HStack>

            <HStack as="nav" spacing={{ base: 6, md: 8 }}>
                {isLoggedIn && (
                    <NavLink to="/meus-pedidos" icon={FiPackage}>Meus Pedidos</NavLink>
                )}
                <Box position="relative">
                    <NavLink to="/cart" icon={FiShoppingCart}>Carrinho</NavLink>
                    {cartItemCount > 0 && (
                        <Badge position="absolute" top="-8px" right="-12px" fontSize="0.7em" colorScheme="red" borderRadius="full" px={2}>
                            {cartItemCount}
                        </Badge>
                    )}
                </Box>
                
                {isLoggedIn ? (
                    <>
                        {isAdmin && (
                            <NavLink to="/admin" icon={FiSettings}>Gerenciar</NavLink>
                        )}
                        <LogoutButton onLogout={onLogout} />
                    </>
                ) : (
                    <NavLink to="/login" icon={FiLogIn}>Login</NavLink>
                )}
            </HStack>
        </Flex>
    );
}

export default Header;