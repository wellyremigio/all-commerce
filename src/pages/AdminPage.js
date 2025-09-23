import React, { useState, useEffect } from 'react';
import {
    Box, Heading, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
    IconButton, HStack, Spinner, Text, Flex
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api';

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        setLoading(true);
        api.get('/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => console.error("Erro ao buscar produtos:", error))
            .finally(() => setLoading(false));
    };

    // NOVA FUNÇÃO PARA DELETAR
    const handleDelete = (id) => {
        // Pede confirmação antes de excluir
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            api.delete(`/products/${id}`)
                .then(() => {
                    alert('Produto excluído com sucesso!');
                    fetchProducts(); // Atualiza a lista de produtos
                })
                .catch(error => {
                    console.error("Erro ao excluir produto:", error);
                    alert('Ocorreu um erro ao excluir o produto.');
                });
        }
    };

    if (loading) {
        return (
            <Box textAlign="center">
                <Spinner size="xl" />
                <Text mt={4}>Carregando produtos...</Text>
            </Box>
        );
    }

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading as="h1" size="xl">Gerenciar Produtos</Heading>
                <HStack>
                    <Button as={RouterLink} to="/admin/orders" colorScheme="blue">
                        Ver Pedidos
                    </Button>
                    <Button
                        as={RouterLink}
                        to="/admin/add"
                        colorScheme="teal"
                        leftIcon={<AddIcon />}
                    >
                        Adicionar Produto
                    </Button>
                </HStack>
            </Flex>
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Nome</Th>
                            <Th>Categoria</Th>
                            <Th isNumeric>Preço</Th>
                            <Th isNumeric>Estoque</Th>
                            <Th>Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {products.map(product => (
                            <Tr key={product.id}>
                                <Td>{product.id}</Td>
                                <Td>{product.name}</Td>
                                <Td>{product.category}</Td>
                                <Td isNumeric>R$ {product.price.toFixed(2)}</Td>
                                <Td isNumeric>{product.stock}</Td>
                                <Td>
                                    <HStack spacing={2}>
                                        <IconButton
                                            aria-label="Editar produto"
                                            icon={<EditIcon />}
                                            colorScheme="blue"
                                            as={RouterLink}
                                            to={`/admin/edit/${product.id}`}
                                        />
                                        <IconButton
                                            aria-label="Excluir produto"
                                            icon={<DeleteIcon />}
                                            colorScheme="red"
                                            onClick={() => handleDelete(product.id)}
                                        />
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminPage;