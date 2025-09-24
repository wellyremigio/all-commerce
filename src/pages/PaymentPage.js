// src/pages/PaymentPage.js

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box, Heading, VStack, Tabs, TabList, Tab, TabPanels, TabPanel,
    FormControl, FormLabel, Input, HStack, Button, Spinner, Text, Image, Center, Select, useToast,
    Flex, Container, Icon, InputGroup, InputLeftElement, Divider, useClipboard
} from '@chakra-ui/react';
import { FiCreditCard, FiUser, FiCalendar, FiLock, FiCopy } from 'react-icons/fi';
import api from '../services/api';

const PaymentPage = ({ onClearCart }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { total, cartItems, shippingMethod } = location.state || { total: 0, cartItems: [], shippingMethod: 'N/A' };

    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvv, setCvv] = useState('');
    
    const pixKey = "00020126330014br.gov.bcb.pix0111123456789012...";
    const { hasCopied, onCopy } = useClipboard(pixKey);

    const handleCardNumberChange = (e) => {
        const formatted = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
        setCardNumber(formatted);
    };
    const handleCardNameChange = (e) => setCardName(e.target.value.replace(/[0-9]/g, ''));
    const handleCvvChange = (e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4));

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear + i);

    const updateStock = async () => {
        const updatePromises = cartItems.map(async (item) => {
            const productResponse = await api.get(`/products/${item.id}`);
            const newStock = productResponse.data.stock - item.quantity;
            return api.patch(`/products/${item.id}`, { stock: newStock });
        });
        await Promise.all(updatePromises);
    };

    const handlePayment = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            toast({ title: 'Erro', description: 'Você precisa estar logado para finalizar a compra.', status: 'error' });
            setIsLoading(false);
            return;
        }

        const newOrder = {
            id: String(new Date().getTime()),
            date: new Date().toISOString(),
            items: cartItems,
            total: total,
            shippingMethod: shippingMethod,
            status: 'Processando',
            userEmail: user.email
        };

        try {
            await api.post('/orders', newOrder);
            await updateStock();

            const localHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
            localHistory.push(newOrder);
            localStorage.setItem('orderHistory', JSON.stringify(localHistory));

            onClearCart();
            toast({
                title: "Pagamento aprovado!",
                description: "Seu pedido foi realizado com sucesso.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            navigate('/meus-pedidos');
        } catch (error) {
            console.error("Erro ao processar o pedido:", error);
            toast({
                title: "Erro no Pagamento",
                description: "Não foi possível processar seu pedido.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <Center flexDirection="column" h="300px">
                <Spinner size="xl" color="blue.500" />
                <Text mt={4}>Processando pagamento, por favor aguarde...</Text>
            </Center>
        );
    }

    return (
        <Container maxW="container.lg" py={10}>
            <Heading as="h1" size="xl" mb={4} textAlign="center" color="blue.800">
                Finalizar Pagamento
            </Heading>
            <Text fontSize="lg" textAlign="center" color="gray.600" mb={8}>
                Revise seu pedido e escolha a forma de pagamento.
            </Text>

            <Flex direction={{ base: 'column', md: 'row' }} gap={10}>
                <Box flex="2" bg="white" p={8} borderRadius="lg" boxShadow="lg">
                    <Tabs isFitted variant="soft-rounded" colorScheme="blue">
                        <TabList mb="1em">
                            <Tab>Cartão de Crédito</Tab>
                            <Tab>PIX</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <form onSubmit={handlePayment}>
                                    <VStack spacing={5}>
                                        <FormControl isRequired>
                                            <FormLabel>Número do Cartão</FormLabel>
                                            <InputGroup>
                                                <InputLeftElement pointerEvents="none" children={<Icon as={FiCreditCard} color="gray.400" />} />
                                                <Input placeholder="0000 0000 0000 0000" value={cardNumber} onChange={handleCardNumberChange} maxLength="19" />
                                            </InputGroup>
                                        </FormControl>
                                        <FormControl isRequired>
                                            <FormLabel>Nome no Cartão</FormLabel>
                                             <InputGroup>
                                                <InputLeftElement pointerEvents="none" children={<Icon as={FiUser} color="gray.400" />} />
                                                <Input placeholder="Como escrito no cartão" value={cardName} onChange={handleCardNameChange} />
                                            </InputGroup>
                                        </FormControl>
                                        <HStack width="full">
                                            <FormControl isRequired>
                                                <FormLabel>Validade</FormLabel>
                                                <HStack>
                                                    <Select placeholder="Mês" value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)}>
                                                        {Array.from({ length: 12 }, (_, i) => (<option key={i + 1} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>))}
                                                    </Select>
                                                    <Select placeholder="Ano" value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)}>
                                                        {years.map(year => (<option key={year} value={year}>{year}</option>))}
                                                    </Select>
                                                </HStack>
                                            </FormControl>
                                            <FormControl isRequired>
                                                <FormLabel>CVV</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none" children={<Icon as={FiLock} color="gray.400" />} />
                                                    <Input placeholder="123" value={cvv} onChange={handleCvvChange} />
                                                </InputGroup>
                                            </FormControl>
                                        </HStack>
                                        <Button type="submit" colorScheme="blue" size="lg" width="full" mt={4}>Pagar com Cartão</Button>
                                    </VStack>
                                </form>
                            </TabPanel>
                            <TabPanel>
                                <VStack spacing={5}>
                                    <Text textAlign="center">Para pagar com PIX, escaneie o QR Code abaixo com o app do seu banco.</Text>
                                    <Image src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Commons_QR_code.png" boxSize="200px" alt="Simulação de QR Code PIX" p={2} borderWidth="1px" borderRadius="md" />
                                    <FormControl>
                                        <FormLabel>Ou use o PIX Copia e Cola:</FormLabel>
                                        <HStack>
                                            <Input isReadOnly value={pixKey} />
                                            <Button onClick={onCopy} leftIcon={<Icon as={FiCopy} />}>
                                                {hasCopied ? "Copiado!" : "Copiar"}
                                            </Button>
                                        </HStack>
                                    </FormControl>
                                    <Button onClick={handlePayment} colorScheme="blue" size="lg" width="full" mt={4}>Confirmar Pagamento PIX</Button>
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>

                <Box flex="1" bg="blue.50" p={6} borderRadius="lg">
                    <Heading as="h3" size="lg" mb={4} color="blue.800">Resumo do Pedido</Heading>
                    <VStack spacing={3} align="stretch">
                        {cartItems.map(item => (
                            <HStack key={item.id} justify="space-between">
                                <Text noOfLines={1}>{item.name} (x{item.quantity})</Text>
                                <Text fontWeight="medium">R$ {(item.price * item.quantity).toFixed(2)}</Text>
                            </HStack>
                        ))}
                        <Divider my={2} />
                        <HStack justify="space-between">
                            <Text>Frete ({shippingMethod || 'N/A'})</Text>
                            <Text fontWeight="medium">R$ 0.00</Text> 
                        </HStack>
                        <Divider my={2} />
                         <HStack justify="space-between" fontWeight="bold" fontSize="xl">
                            <Text color="blue.800">Total a Pagar</Text>
                            <Text color="blue.800">R$ {total.toFixed(2)}</Text>
                        </HStack>
                    </VStack>
                </Box>
            </Flex>
        </Container>
    );
};

export default PaymentPage;