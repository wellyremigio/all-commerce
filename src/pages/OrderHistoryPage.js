import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Button, HStack, Tag } from '@chakra-ui/react';

const OrderHistoryPage = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const localHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        setHistory(localHistory.sort((a, b) => new Date(b.date) - new Date(a.date))); // Ordena por data
    }, []);

    if (history.length === 0) {
        return (
            <Box>
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
                        {/* ... (código do AccordionButton) ... */}
                        <AccordionPanel pb={4}>
                            <Text fontWeight="bold" mb={2}>Itens:</Text>
                            {order.items.map(item => (
                                <HStack key={item.id} justify="space-between">
                                    <Box>
                                        <Text>{item.name} (x{item.quantity})</Text>
                                        {/* CONDIÇÃO PARA MOSTRAR O BOTÃO DE DOWNLOAD */}
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
                            {/* ... (resto do painel do pedido) ... */}
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </Box>
    );
};

export default OrderHistoryPage;