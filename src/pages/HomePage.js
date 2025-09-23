import React, { useState, useEffect } from 'react';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const HomePage = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("Houve um erro ao buscar os produtos!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Text>Carregando produtos...</Text>;
  }

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Bem-vindo à All Commerce
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
        {products.map(product => (
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