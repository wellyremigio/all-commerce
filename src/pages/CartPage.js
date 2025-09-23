import React from 'react';
import {
  Box, Heading, Text, Button, VStack, HStack, IconButton, Stack // 'Divider' foi removido daqui
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const CartPage = ({ cartItems, onRemoveFromCart, onClearCart }) => {
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = () => {
    alert(`Compra finalizada com sucesso! Total: R$ ${total.toFixed(2)}. Obrigado por comprar na All Commerce!`);
    onClearCart();
  };

  if (cartItems.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Heading as="h2" size="lg">Seu carrinho está vazio.</Heading>
        <Text mt={4}>Que tal adicionar alguns produtos?</Text>
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto">
      <Heading as="h2" size="xl" mb={6}>
        Seu Carrinho
      </Heading>

      <VStack spacing={4} align="stretch" mb={8}>
        {cartItems.map((item, index) => (
          <HStack key={`${item.id}-${index}`} justify="space-between" p={4} borderWidth="1px" borderRadius="md">
            <Text fontWeight="bold">{item.name}</Text>
            <HStack>
              <Text>R$ {item.price.toFixed(2)}</Text>
              <IconButton
                aria-label="Remover item"
                icon={<DeleteIcon />}
                colorScheme="red"
                variant="ghost"
                onClick={() => onRemoveFromCart(item)}
              />
            </HStack>
          </HStack>
        ))}
      </VStack>

      {/* AQUI ESTÁ A SUBSTITUIÇÃO */}
      <Box height="1px" bg="gray.200" my={4} />

      <HStack justify="space-between" my={4}>
        <Text fontSize="xl" fontWeight="bold">Total:</Text>
        <Text fontSize="2xl" fontWeight="bold" color="teal.600">
          R$ {total.toFixed(2)}
        </Text>
      </HStack>

      <Box p={6} borderWidth="1px" borderRadius="md" mt={6}>
        <Heading as="h3" size="lg" mb={4}>Simulação de Pagamento</Heading>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <Button colorScheme="blue" flex="1">Pagar com Cartão de Crédito</Button>
          <Button colorScheme="green" flex="1">Pagar com PIX</Button>
        </Stack>
        <Button
          colorScheme="teal"
          size="lg"
          width="100%"
          mt={4}
          onClick={handleCheckout}
        >
          Finalizar Compra
        </Button>
      </Box>
    </Box>
  );
};

export default CartPage;