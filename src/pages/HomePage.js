// src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import {
    Box, Heading, Text, Button, Wrap, WrapItem, SimpleGrid, Spinner, Flex, Container
} from '@chakra-ui/react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const HomePage = ({ onAddToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Todas');

    useEffect(() => {
        api.get('/products')
            .then(response => {
                const fetchedProducts = response.data;
                setProducts(fetchedProducts);
                const uniqueCategories = [...new Set(fetchedProducts.map(p => p.category))];
                setCategories(['Todas', ...uniqueCategories]);
            })
            .catch(error => {
                console.error("Houve um erro ao buscar os produtos!", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const filteredProducts = activeCategory === 'Todas'
        ? products
        : products.filter(product => product.category === activeCategory);

    // MELHORIA: Spinner de carregamento mais profissional
    if (loading) {
        return (
            <Flex justify="center" align="center" height="60vh">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    return (
        <Box>
            {/* MELHORIA: Seção de "Boas-Vindas" (Hero Section) */}
            <Box bg="blue.50" py={12} mb={10} borderRadius="lg">
                <Container maxW="container.lg" textAlign="center">
                    <Heading as="h1" size="2xl" color="blue.800" mb={3}>
                        Bem-vindo à All Commerce!
                    </Heading>
                    <Text fontSize="lg" color="blue.700">
                        Os melhores produtos do comércio local, a um clique de distância.
                    </Text>
                </Container>
            </Box>

            {/* MELHORIA: Seção de produtos com título e filtros estilizados */}
            <Container maxW="container.xl">
                <Heading as="h2" size="xl" mb={4} textAlign="center">
                    Nossos Produtos
                </Heading>
                <Text textAlign="center" color="gray.600" mb={8}>Navegue por categoria:</Text>

                {/* MELHORIA: Botões de Filtro com o tema azul */}
                <Wrap spacing={3} justify="center" mb={12}>
                    {categories.map(category => (
                        <WrapItem key={category}>
                            <Button
                                colorScheme="blue" // Tema azul
                                variant={activeCategory === category ? 'solid' : 'outline'}
                                onClick={() => setActiveCategory(category)}
                                borderRadius="full" // Botões arredondados
                                px={6}
                            >
                                {category}
                            </Button>
                        </WrapItem>
                    ))}
                </Wrap>

                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={onAddToCart}
                        />
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export default HomePage;