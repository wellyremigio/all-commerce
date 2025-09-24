// src/components/Header.js

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, HStack, Text, Icon, Badge } from '@chakra-ui/react';
// Importando os ícones que vamos usar
import { FiPackage, FiShoppingCart, FiSettings } from 'react-icons/fi';

// O caminho do logo continua o mesmo
const logoPath = '/assets/logo.png';

// Um pequeno componente para deixar nosso código mais limpo e repetirmos menos
const NavLink = ({ to, icon, children }) => (
    <HStack
        as={RouterLink}
        to={to}
        spacing={2}
        align="center"
        color="gray.600"
        fontWeight="medium"
        _hover={{ color: 'blue.500', textDecoration: 'none' }}
        transition="color 0.2s"
    >
        <Icon as={icon} w={5} h={5} />
        <Text display={{ base: 'none', md: 'block' }}>{children}</Text>
    </HStack>
);

function Header({ cartItemCount }) {
    return (
        <Flex
            as="header"
            justify="space-between"
            align="center"
            bg="white"
            px={{ base: 4, md: 8 }} // Padding responsivo
            h="75px"
            boxShadow="sm"
            borderBottom="1px solid"
            borderColor="gray.200"
        >
            {/* Lado Esquerdo: Logo */}
            <HStack as={RouterLink} to="/" spacing={3} _hover={{ textDecoration: 'none' }}>
                <img src={logoPath} alt="Logo da All Commerce" style={{ height: '45px' }} />
                <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    All Commerce
                </Text>
            </HStack>

            {/* Lado Direito: Links de Navegação com Ícones */}
            <HStack as="nav" spacing={{ base: 6, md: 8 }}>
                <NavLink to="/meus-pedidos" icon={FiPackage}>
                    Meus Pedidos
                </NavLink>

                <Box position="relative">
                    <NavLink to="/cart" icon={FiShoppingCart}>
                        Carrinho
                    </NavLink>
                    {cartItemCount > 0 && (
                        <Badge
                            position="absolute"
                            top="-8px"
                            right="-12px"
                            fontSize="0.7em"
                            colorScheme="red"
                            borderRadius="full"
                            px={2}
                        >
                            {cartItemCount}
                        </Badge>
                    )}
                </Box>

                <NavLink to="/admin" icon={FiSettings}>
                    Gerenciar
                </NavLink>
            </HStack>
        </Flex>
    );
}

export default Header;