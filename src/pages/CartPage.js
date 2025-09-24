// src/pages/CartPage.js

import { useState } from "react";
import {
    Box, Heading, Text, Button, VStack, HStack, Divider, IconButton, Radio, RadioGroup,
    Input, InputGroup, InputRightElement, useToast, Container, Flex, Image, Icon,
    Link as ChakraLink
} from '@chakra-ui/react';
// CORREÇÃO: Importando os ícones dos lugares corretos
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { FiShoppingCart } from 'react-icons/fi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const CartPage = ({ cartItems, onAddToCart, onRemoveFromCart, onClearCart }) => {
    const [cep, setCep] = useState('');
    const [shippingCost, setShippingCost] = useState(null);
    const [shippingMethod, setShippingMethod] = useState('');
    const [showShippingOptions, setShowShippingOptions] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const onlyDigitalProducts = cartItems.every(item => item.type === 'digital');

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxRate = 0.05;
    const taxes = subtotal * taxRate;
    const total = subtotal + taxes + (shippingCost || 0);

    const handleCalculateShipping = () => {
        if (cep.replace(/\D/g, '').length === 8) {
            toast({ title: 'Opções de frete disponíveis.', status: 'info', duration: 3000, isClosable: true });
            setShowShippingOptions(true);
        } else {
            toast({ title: 'CEP inválido.', description: "Por favor, digite um CEP com 8 dígitos.", status: 'error', duration: 3000, isClosable: true });
            setShowShippingOptions(false);
        }
    };
    
    const handleCheckout = () => {
        navigate('/payment', { state: { total: total, cartItems: cartItems, shippingMethod: shippingMethod } });
    };

    if (cartItems.length === 0) {
        return (
            <Container textAlign="center" py={20}>
                <Icon as={FiShoppingCart} w={16} h={16} color="blue.300" />
                <Heading as="h2" size="lg" mt={6} mb={2}>Seu carrinho está vazio.</Heading>
                <Text color={'gray.500'}>
                    Parece que você ainda não adicionou nenhum produto.
                </Text>
                <Button as={RouterLink} to="/" colorScheme="blue" mt={6}>
                    Continuar Comprando
                </Button>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={10}>
            <Heading as="h1" size="xl" mb={8} color="blue.800">Seu Carrinho</Heading>
            
            <Flex direction={{ base: 'column', lg: 'row' }} gap={10}>
                <Box flex="2">
                    <VStack spacing={4} align="stretch">
                        {cartItems.map(item => (
                            <Flex key={item.id} justify="space-between" align="center" p={4} borderWidth="1px" borderRadius="md">
                                <HStack spacing={4}>
                                    <Image src={item.image} boxSize="80px" objectFit="cover" borderRadius="md" />
                                    <VStack align="start" spacing={1}>
                                        <Text fontWeight="bold">{item.name}</Text>
                                        <Text fontSize="sm" color="gray.600">R$ {item.price.toFixed(2)} / unidade</Text>
                                    </VStack>
                                </HStack>
                                <HStack>
                                    <IconButton size="sm" icon={<MinusIcon />} onClick={() => onRemoveFromCart(item)} aria-label="Diminuir quantidade" />
                                    <Text fontWeight="bold" minW="20px" textAlign="center">{item.quantity}</Text>
                                    <IconButton size="sm" icon={<AddIcon />} onClick={() => onAddToCart(item)} aria-label="Aumentar quantidade" />
                                </HStack>
                                <Text fontWeight="bold" minW="80px" textAlign="right">R$ {(item.price * item.quantity).toFixed(2)}</Text>
                            </Flex>
                        ))}
                    </VStack>
                    
                    {!onlyDigitalProducts && (
                        <Box my={8}>
                            <Heading as="h3" size="md" mb={4}>Opções de Entrega</Heading>
                            <InputGroup size="md" maxW="300px">
                                <Input placeholder="Digite seu CEP" value={cep} onChange={(e) => setCep(e.target.value)} />
                                <InputRightElement width="5.5rem">
                                    <Button h="1.75rem" size="sm" onClick={handleCalculateShipping} colorScheme="blue">Calcular</Button>
                                </InputRightElement>
                            </InputGroup>

                            {showShippingOptions && (
                                <RadioGroup onChange={setShippingMethod} value={shippingMethod} mt={4}>
                                    <VStack align="stretch" spacing={3} p={4} borderWidth="1px" borderRadius="md">
                                        <Radio value="Retirada no Local" onChange={() => setShippingCost(0)}>
                                            <Text>Retirada no Local <Text as="span" color="green.500" fontWeight="bold">(Grátis)</Text></Text>
                                        </Radio>
                                        <Radio value="Correios PAC" onChange={() => setShippingCost(25.00)}>
                                            <Text>Correios (PAC) - 7 dias úteis <Text as="span" fontWeight="bold">(R$ 25,00)</Text></Text>
                                        </Radio>
                                        <Radio value="Transportadora X" onChange={() => setShippingCost(40.00)}>
                                            <Text>Transportadora X - 3 dias úteis <Text as="span" fontWeight="bold">(R$ 40,00)</Text></Text>
                                        </Radio>
                                    </VStack>
                                </RadioGroup>
                            )}
                        </Box>
                    )}
                </Box>

                <Box flex="1" bg="blue.50" p={6} borderRadius="lg" h="fit-content" position="sticky" top="100px">
                    <Heading as="h3" size="lg" mb={6} color="blue.800">Resumo do Pedido</Heading>
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
                            <Text>
                                {onlyDigitalProducts ? 'Não aplicável' : shippingCost !== null ? `R$ ${shippingCost.toFixed(2)}` : 'A calcular'}
                            </Text>
                        </HStack>
                        <Divider my={3} />
                        <HStack justify="space-between" fontWeight="bold" fontSize="xl">
                            <Text color="blue.800">Total</Text>
                            <Text color="blue.800">R$ {total.toFixed(2)}</Text>
                        </HStack>
                    </VStack>
                    <Button
                        colorScheme="blue" size="lg" width="100%" mt={6}
                        onClick={handleCheckout}
                        isDisabled={!onlyDigitalProducts && shippingCost === null}
                    >
                        {onlyDigitalProducts || shippingCost !== null ? 'Ir para Pagamento' : 'Escolha o frete para continuar'}
                    </Button>
                </Box>
            </Flex>
        </Container>
    );
};

export default CartPage;