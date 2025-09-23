import { Box, Image, Text, Button, Stack, Heading, Tag } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md">
      <Image src={product.image} alt={product.name} objectFit="cover" />
      <Box p={6}>
        <Stack spacing={3}>
          <Tag colorScheme="teal" variant="solid" size="sm" alignSelf="flex-start">
            {product.category}
          </Tag>
          <Heading as="h3" size="md" noOfLines={2}>
            {product.name}
          </Heading>
          <Text fontWeight="bold" fontSize="2xl" color="teal.600">
            R$ {product.price.toFixed(2)}
          </Text>
          <Button
            colorScheme="teal"
            leftIcon={<AddIcon />}
            onClick={() => onAddToCart(product)}
          >
            Adicionar ao Carrinho
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProductCard;