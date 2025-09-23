import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box, Heading, VStack, Tabs, TabList, Tab, TabPanels, TabPanel,
    FormControl, FormLabel, Input, HStack, Button, Spinner, Text, Image, Center, Select
} from '@chakra-ui/react';
import api from '../services/api';

const PaymentPage = ({ onClearCart }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { total, cartItems, shippingMethod } = location.state || { total: 0, cartItems: [], shippingMethod: 'N/A' };

    const [isLoading, setIsLoading] = useState(false);

    // Estados para controlar os campos do formulário
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvv, setCvv] = useState('');

    // --- FUNÇÕES DE FORMATAÇÃO E VALIDAÇÃO ---

    const handleCardNumberChange = (e) => {
        // 1. Remove tudo que não for dígito
        const digitsOnly = e.target.value.replace(/\D/g, '');
        // 2. Limita a 16 dígitos
        const truncated = digitsOnly.slice(0, 16);
        // 3. Adiciona espaços a cada 4 dígitos
        const formatted = truncated.replace(/(\d{4})/g, '$1 ').trim();
        setCardNumber(formatted);
    };

    const handleCardNameChange = (e) => {
        // Remove qualquer dígito do nome
        const nameOnly = e.target.value.replace(/[0-9]/g, '');
        setCardName(nameOnly);
    };

    const handleCvvChange = (e) => {
        // Permite apenas 3 ou 4 dígitos
        const cvvOnly = e.target.value.replace(/\D/g, '').slice(0, 4);
        setCvv(cvvOnly);
    };

    // Gera as opções de ano (do ano atual para os próximos 10)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear + i);

      const handlePayment = (event) => {
    event.preventDefault();
    setIsLoading(true);

    const newOrder = {
      id: new Date().getTime(), // ID único baseado no tempo
      date: new Date().toISOString(),
      items: cartItems,
      total: total,
      shippingMethod: shippingMethod,
      status: 'Processando'
    };

    api.post('/orders', newOrder)
      .then(() => {
        const localHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        localHistory.push(newOrder);
        localStorage.setItem('orderHistory', JSON.stringify(localHistory));

        setIsLoading(false);
        alert('Pagamento aprovado com sucesso! Pedido realizado.');
        onClearCart();
        navigate('/');
      })
      .catch(error => {
        setIsLoading(false);
        console.error("Erro ao criar pedido:", error);
        alert('Ocorreu um erro ao processar seu pedido.');
      });
  };

    if (isLoading) {
        return (
            <Center flexDirection="column" h="300px">
                <Spinner size="xl" />
                <Text mt={4}>Processando pagamento, por favor aguarde...</Text>
            </Center>
        );
    }

    return (
        <Box maxW="600px" mx="auto">
            <Heading as="h1" size="xl" mb={6} textAlign="center">
                Finalizar Pagamento
            </Heading>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={8}>
                Total a Pagar: R$ {total.toFixed(2)}
            </Text>

            <Tabs isFitted variant="enclosed" colorScheme="teal">
                <TabList mb="1em">
                    <Tab>Cartão de Crédito</Tab>
                    <Tab>PIX</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <form onSubmit={handlePayment}>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Número do Cartão</FormLabel>
                                    <Input
                                        placeholder="0000 0000 0000 0000"
                                        value={cardNumber}
                                        onChange={handleCardNumberChange}
                                        maxLength="19" // 16 dígitos + 3 espaços
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Nome no Cartão</FormLabel>
                                    <Input
                                        placeholder="Como escrito no cartão"
                                        value={cardName}
                                        onChange={handleCardNameChange}
                                    />
                                </FormControl>
                                <HStack width="full">
                                    <FormControl isRequired>
                                        <FormLabel>Validade</FormLabel>
                                        <HStack>
                                            <Select placeholder="Mês" value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)}>
                                                {Array.from({ length: 12 }, (_, i) => (
                                                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                                        {String(i + 1).padStart(2, '0')}
                                                    </option>
                                                ))}
                                            </Select>
                                            <Select placeholder="Ano" value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)}>
                                                {years.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </Select>
                                        </HStack>
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormLabel>CVV</FormLabel>
                                        <Input
                                            placeholder="123"
                                            value={cvv}
                                            onChange={handleCvvChange}
                                        />
                                    </FormControl>
                                </HStack>
                                <Button type="submit" colorScheme="teal" size="lg" width="full" mt={4}>
                                    Pagar com Cartão
                                </Button>
                            </VStack>
                        </form>
                    </TabPanel>
                    <TabPanel>
                        {/* ... (código do PIX continua o mesmo) ... */}
                        <VStack spacing={4}>
                            <Text>Para pagar com PIX, escaneie o QR Code abaixo com o app do seu banco.</Text>
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"
                                boxSize="200px"
                                alt="Simulação de QR Code PIX"
                                fallbackSrc="https://via.placeholder.com/200"
                            />
                            <FormControl>
                                <FormLabel>Ou use o PIX Copia e Cola:</FormLabel>
                                <Input isReadOnly value="00020126330014br.gov.bcb.pix0111123456789012..." />
                            </FormControl>
                            <Button onClick={handlePayment} colorScheme="teal" size="lg" width="full" mt={4}>
                                Confirmar Pagamento
                            </Button>
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default PaymentPage;