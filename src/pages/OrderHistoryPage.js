import { useState, useEffect } from 'react';
import {
    Box, Heading, Text, Button, VStack, HStack, Tag,
    Flex, Image, Divider, Icon, Container, Spinner
} from '@chakra-ui/react';
import { FiPackage } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const OrderHistoryPage = () => {
    const [orders, setOrders]

        = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setUser(loggedInUser);
            const localHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
            const userOrders = localHistory.filter(order => order.userEmail === loggedInUser.email);
            setOrders(userOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <Flex justify="center" align="center" height="60vh"><Spinner size="xl" /></Flex>;
    }

    if (orders.length === 0) {
        return (
            <Container textAlign="center" py={20}>
                <Icon as={FiPackage} w={16} h={16} color="blue.300" />
                <Heading as="h2" size="lg" mt={6} mb={2}>Nenhum pedido encontrado</Heading>
                <Text color={'gray.500'}>
                    Você ainda não fez nenhuma compra. Que tal explorar nossos produtos?
                </Text>
                <Button as={RouterLink} to="/" colorScheme="blue" mt={6}>
                    Ir para a Loja
                </Button>
            </Container>
        );
    }

    const getStatusColorScheme = (status) => {
        switch (status) {
            case 'Processando': return 'yellow';
            case 'Enviado': return 'blue';
            case 'Concluído': return 'green';
            default: return 'gray';
        }
    };

    return (
        <Container maxW="container.lg" py={10}>
            <Heading as="h1" size="xl" mb={8} color="blue.800">Meus Pedidos</Heading>
            <VStack spacing={6} align="stretch">
                {orders.map(order => (
                    <Box key={order.id} bg="white" p={6} borderRadius="lg" boxShadow="md">
                        <Flex justify="space-between" align="center" mb={4}>
                            <Box>
                                <Heading size="md">Pedido #{order.id}</Heading>
                                <Text fontSize="sm" color="gray.500">
                                    Realizado em: {new Date(order.date).toLocaleDateString('pt-BR')}
                                </Text>
                            </Box>
                            <Tag colorScheme={getStatusColorScheme(order.status)} size="lg">{order.status}</Tag>
                        </Flex>
                        <Divider />
                        <VStack spacing={4} align="stretch" mt={4}>
                            {order.items.map(item => (
                                <HStack key={item.id} spacing={4}>
                                    <Image src={item.image} boxSize="60px" objectFit="cover" borderRadius="md" />
                                    <Flex justify="space-between" w="full">
                                        <Box>
                                            <Text fontWeight="medium">{item.name}</Text>
                                            <Text fontSize="sm" color="gray.500">Qtd: {item.quantity}</Text>
                                        </Box>
                                        <Text fontWeight="medium">R$ {(item.price * item.quantity).toFixed(2)}</Text>
                                    </Flex>
                                </HStack>
                            ))}
                        </VStack>
                        <Divider my={4} />
                        <HStack justify="space-between">
                            <Text fontSize="lg" fontWeight="bold" color="blue.800">Total do Pedido:</Text>
                            <Text fontSize="lg" fontWeight="bold" color="blue.800">R$ {order.total.toFixed(2)}</Text>
                        </HStack>
                    </Box>
                ))}
            </VStack>
        </Container>
    );
};

export default OrderHistoryPage;

