import React, { useState, useEffect } from 'react';
import {
  Box, Heading, Spinner, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, HStack, Tag
} from '@chakra-ui/react';
import api from '../services/api';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders?_sort=date&_order=desc') // Pede os pedidos ordenados por data
      .then(response => setOrders(response.data))
      .catch(error => console.error("Erro ao buscar pedidos:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (orders.length === 0) return <Text>Nenhum pedido encontrado.</Text>;

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
                <Tag colorScheme={order.status === 'Processando' ? 'yellow' : 'green'}>{order.status}</Tag>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text fontWeight="bold" mb={2}>Itens:</Text>
              {order.items.map(item => (
                <HStack key={item.id} justify="space-between">
                  <Text>{item.name} (x{item.quantity})</Text>
                  <Text>R$ {(item.price * item.quantity).toFixed(2)}</Text>
                </HStack>
              ))}
              <hr />
              <Text fontWeight="bold" mt={2} textAlign="right">Total: R$ {order.total.toFixed(2)}</Text>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default AdminOrdersPage;