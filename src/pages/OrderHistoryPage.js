// src/pages/OrderHistoryPage.js

import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Button, HStack, Tag, VStack, Divider } from '@chakra-ui/react';

const OrderHistoryPage = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const localHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        setHistory(localHistory.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }, []);

    if (history.length === 0) {
        return (
            <Box textAlign="center">
                <Heading as="h1" size="xl" mb={6}>Meus Pedidos</Heading>
                <Text>Você ainda não fez nenhum pedido.</Text>
            </Box>
        );
    }

    return (
        <Box>
            <Heading as="h1" size="xl" mb={6}>Meus Pedidos</Heading>
            <Accordion allowMultiple>
                {history.map(order => (
                    <AccordionItem key={order.id}>
                        <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    <Text fontWeight="bold">Pedido #{order.id} - {new Date(order.date).toLocaleString('pt-BR')}</Text>
                                </Box>
                                {/* TAG DE STATUS ADICIONADA AQUI */}
                                <Tag colorScheme={order.status === 'Processando' ? 'yellow' : (order.status === 'Enviado' ? 'blue' : 'green')}>{order.status}</Tag>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <Text fontWeight="bold" mb={2}>Itens:</Text>
                            <VStack align="stretch" spacing={2}>
                                {order.items.map(item => (
                                    <HStack key={`${order.id}-${item.id}`} justify="space-between">
                                        <Box>
                                            <Text>{item.name} (x{item.quantity})</Text>
                                            {item.type === 'digital' && (
                                                <Button
                                                    as="a"
                                                    href={item.downloadLink}
                                                    target="_blank"
                                                    size="xs"
                                                    colorScheme="green"
                                                    mt={1}
                                                >
                                                    Baixar Agora
                                                </Button>
                                            )}
                                        </Box>
                                        <Text>R$ {(item.price * item.quantity).toFixed(2)}</Text>
                                    </HStack>
                                ))}
                            </VStack>
                            <Divider my={3} />
                            <HStack justify="space-between" fontWeight="bold">
                                <Text>Total do Pedido:</Text>
                                <Text>R$ {order.total.toFixed(2)}</Text>
                            </HStack>
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </Box>
    );
};

export default OrderHistoryPage;