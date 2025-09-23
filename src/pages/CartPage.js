import React, { useState } from 'react';
import {
  Box, Heading, Text, Button, VStack, HStack, Divider, IconButton, Stack,
  Input, InputGroup, InputRightElement, useToast
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon, MinusIcon } from '@chakra-ui/icons';

const CartPage = ({ cartItems, onAddToCart, onRemoveFromCart, onClearCart }) => {
  const [cep, setCep] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const toast = useToast();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxRate = 0.05; // Imposto simulado de 5%
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes + shippingCost;

  const handleCalculateShipping = () => {
    if (cep.replace('-', '').length === 8) {
      setShippingCost(25.00);
      toast({
        title: 'Frete calculado.',
        description: "Adicionamos o valor do frete ao seu total.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'CEP inválido.',
        description: "Por favor, digite um CEP com 8 dígitos.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCheckout = () => {
    alert(`(Simulação) Compra finalizada com sucesso! Total: R$ ${total.toFixed(2)}. Obrigado por comprar na All Commerce!`);
    onClearCart();
  };

  if (cartItems.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Heading as="h2" size="lg">Seu carrinho está vazio.</Heading>
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto">
      <Heading as="h2" size="xl" mb={6}>Seu Carrinho</Heading>
      <VStack spacing={4} align="stretch" mb={8}>
        {cartItems.map(item => (
          <HStack key={item.id} justify="space-between" p={4} borderWidth="1px" borderRadius="md">
            <VStack align="start">
              <Text fontWeight="bold">{item.name}</Text>
              <Text fontSize="sm" color="gray.600">R$ {item.price.toFixed(2)} / unidade</Text>
            </VStack>
            <HStack>
              <IconButton size="sm" icon={<MinusIcon />} onClick={() => onRemoveFromCart(item)} aria-label="Diminuir quantidade" />
              <Text fontWeight="bold" minW="20px" textAlign="center">{item.quantity}</Text>
              <IconButton size="sm" icon={<AddIcon />} onClick={() => onAddToCart(item)} aria-label="Aumentar quantidade" />
            </HStack>
            <Text fontWeight="bold">R$ {(item.price * item.quantity).toFixed(2)}</Text>
          </HStack>
        ))}
      </VStack>

      <Divider />

      {/* Seção de Frete */}
      <Box my={6}>
        <Heading as="h3" size="md" mb={2}>Calcular Frete</Heading>
        <InputGroup size="md" maxW="300px">
          <Input
            placeholder="Digite seu CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleCalculateShipping}>
              Calcular
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>

      {/* Resumo Financeiro */}
      <Box p={6} borderWidth="1px" borderRadius="md" mt={6}>
        <Heading as="h3" size="lg" mb={4}>Resumo do Pedido</Heading>
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Text>Subtotal</Text>
            <Text>R$ {subtotal.toFixed(2)}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Impostos ({(taxRate * 100).toFixed(0)}%)</Text>
            <Text>R$ {taxes.toFixed(2)}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Frete</Text>
            <Text>{shippingCost > 0 ? `R$ ${shippingCost.toFixed(2)}` : 'A calcular'}</Text>
          </HStack>
          <Divider my={2} />
          <HStack justify="space-between">
            <Text fontSize="xl" fontWeight="bold">Total</Text>
            <Text fontSize="xl" fontWeight="bold" color="teal.600">R$ {total.toFixed(2)}</Text>
          </HStack>
        </VStack>
        <Button
          colorScheme="teal" size="lg" width="100%" mt={6}
          onClick={handleCheckout}
          isDisabled={shippingCost === 0}
        >
          {shippingCost > 0 ? 'Finalizar Compra' : 'Calcule o frete para continuar'}
        </Button>
      </Box>
    </Box>
  );
};

export default CartPage;