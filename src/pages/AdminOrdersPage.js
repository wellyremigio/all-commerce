// src/pages/AdminOrdersPage.js

import React, { useState, useEffect } from 'react';
import {
    Box, Heading, Spinner, Text, Accordion, AccordionItem, AccordionButton,
    AccordionPanel, AccordionIcon, HStack, Tag, Select, useToast, VStack, Divider, Flex
} from '@chakra-ui/react';
import api from '../services/api';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        api.get('/orders?_sort=date&_order=desc')
            .then(response => setOrders(response.data))
            .catch(error => console.error("Erro ao buscar pedidos:", error))
            .finally(() => setLoading(false));
    };

    const handleStatusChange = (orderId, newStatus) => {
        api.patch(`/orders/${orderId}`, { status: newStatus })
            .then(() => {
                toast({
                    title: "Status atualizado!",
                    description: `(Simulação de e-mail enviado para o cliente sobre o status: ${newStatus})`,
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                });
                fetchOrders();
            })
            .catch(error => console.error("Erro ao atualizar status:", error));
    };

    if (loading) return <Flex justify="center" align="center" height="60vh"><Spinner size="xl" /></Flex>;
    if (orders.length === 0) return <Text textAlign="center">Nenhum pedido encontrado.</Text>;

    return (
        <Box>
            <Heading as="h1" size="xl" mb={6}>Painel de Pedidos</Heading>
            <Accordion allowMultiple>
                {orders.map(order => (
                    <AccordionItem key={order.id}>
                        <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    <Text fontWeight="bold">Pedido #{order.id} - {new Date(order.date).toLocaleString('pt-BR')}</Text>
                                </Box>
                                <Tag colorScheme={order.status === 'Processando' ? 'yellow' : (order.status === 'Enviado' ? 'blue' : 'green')}>{order.status}</Tag>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <VStack align="stretch" spacing={2}>
                                {order.items.map(item => (
                                    <HStack key={`${order.id}-${item.id}`} justify="space-between">
                                        <Text>{item.name} (x{item.quantity})</Text>
                                        <Text>R$ {(item.price * item.quantity).toFixed(2)}</Text>
                                    </HStack>
                                ))}
                            </VStack>
                            <Divider my={3} />
                            <HStack justify="space-between">
                                <Text fontWeight="bold">Total do Pedido:</Text>
                                <Text fontWeight="bold">R$ {order.total.toFixed(2)}</Text>
                            </HStack>
                            <Divider my={3} />
                            <HStack>
                                <Text fontWeight="bold">Mudar Status:</Text>
                                <Select
                                    defaultValue={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    size="sm"
                                    maxW="200px"
                                >
                                    <option value="Processando">Processando</option>
                                    <option value="Enviado">Enviado</option>
                                    <option value="Concluído">Concluído</option>
                                </Select>
                            </HStack>
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </Box>
    );
};

export default AdminOrdersPage;