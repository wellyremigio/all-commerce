import { useState } from "react";
import {
    Box, Heading, Text, Button, VStack, HStack, Divider, IconButton, Radio, RadioGroup,
    Input, InputGroup, InputRightElement, useToast
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const CartPage = ({ cartItems, onAddToCart, onRemoveFromCart, onClearCart }) => {
    const [cep, setCep] = useState('');
    const [shippingCost, setShippingCost] = useState(null);
    const [shippingMethod, setShippingMethod] = useState('');
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
        } else {
            toast({ title: 'CEP inválido.', description: "Por favor, digite um CEP com 8 dígitos.", status: 'error', duration: 3000, isClosable: true });
        }
    };
    
    const handleCheckout = () => {
        navigate('/payment', { state: { total: total, cartItems: cartItems, shippingMethod: shippingMethod } });
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
            
            {/* 1. Listagem de Produtos com Controle de Quantidade */}
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

            {/* 2. Opções de Entrega */}
            {!onlyDigitalProducts && (
                <Box my={6}>
                    <Heading as="h3" size="md" mb={2}>Opções de Entrega</Heading>
                    <InputGroup size="md" maxW="300px">
                        <Input placeholder="Digite seu CEP" value={cep} onChange={(e) => setCep(e.target.value)} />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={handleCalculateShipping}>Calcular</Button>
                        </InputRightElement>
                    </InputGroup>

                    <RadioGroup onChange={setShippingMethod} value={shippingMethod} mt={4}>
                        <VStack align="start" spacing={3}>
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
                </Box>
            )}

            {/* 3. Resumo Financeiro e Botão para Pagamento */}
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
                        <Text>
                            {onlyDigitalProducts ? 'Não aplicável' : shippingCost !== null ? `R$ ${shippingCost.toFixed(2)}` : 'A calcular'}
                        </Text>
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
                    isDisabled={!onlyDigitalProducts && shippingCost === null}
                >
                    {onlyDigitalProducts || shippingCost !== null ? 'Ir para Pagamento' : 'Escolha o frete para continuar'}
                </Button>
            </Box>
        </Box>
    );
};

export default CartPage;