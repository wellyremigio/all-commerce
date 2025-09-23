import React, { useState, useEffect } from 'react';
import { Box, Heading, SimpleGrid, Text, Wrap, WrapItem, Button } from '@chakra-ui/react';
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
        // Extrai categorias únicas dos produtos
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

  // Filtra os produtos com base na categoria ativa
  const filteredProducts = activeCategory === 'Todas'
    ? products
    : products.filter(product => product.category === activeCategory);

  if (loading) {
    return <Text>Carregando produtos...</Text>;
  }

  return (
    <Box>
      <Heading as="h1" size="xl" mb={4} textAlign="center">
        Nossos Produtos
      </Heading>
      <Text textAlign="center" mb={8}>Navegue por categoria:</Text>

      {/* Botões de Filtro de Categoria */}
      <Wrap spacing={4} justify="center" mb={10}>
        {categories.map(category => (
          <WrapItem key={category}>
            <Button
              colorScheme="teal"
              variant={activeCategory === category ? 'solid' : 'outline'}
              onClick={() => setActiveCategory(category)}
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
    </Box>
  );
};

export default HomePage;