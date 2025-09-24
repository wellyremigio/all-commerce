import React from 'react';
import { Box, Image, Text, Button, Badge, VStack, Heading, Icon } from '@chakra-ui/react';
import { FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  // Esta função impede que o clique no botão ative o link do card.
  const handleAddToCartClick = (e) => {
    e.preventDefault(); // Impede a navegação do Link pai.
    onAddToCart(product);
  };

  return (
    // O card inteiro agora é um link para a página de detalhes do produto.
    <Link to={`/produto/${product.id}`} style={{ textDecoration: 'none' }}>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="sm"
        transition="all 0.3s"
        _hover={{ boxShadow: 'xl', transform: 'translateY(-5px)' }}
        height="100%" // Garante que todos os cards na mesma linha tenham a mesma altura.
      >
        <Image 
          src={product.image || `https://placehold.co/600x400?text=${product.name}`} 
          alt={product.name} 
          objectFit="cover"
          height="200px"
          width="100%"
        />

        <VStack p="6" spacing="3" align="stretch">
          <Badge borderRadius="full" px="2" colorScheme="blue">
            {product.category}
          </Badge>
          
          <Heading as="h3" size="md" fontWeight="semibold" noOfLines={2} height="3rem">
            {product.name}
          </Heading>
          
          <Text fontWeight="bold" fontSize="2xl" color="blue.600">
            R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
          </Text>
          
          <Button 
            leftIcon={<Icon as={FiShoppingCart} />} 
            colorScheme="blue" 
            variant="solid"
            onClick={handleAddToCartClick} // Usando a função para evitar a navegação.
          >
            Adicionar ao Carrinho
          </Button>
        </VStack>
      </Box>
    </Link>
  );
};

export default ProductCard;

