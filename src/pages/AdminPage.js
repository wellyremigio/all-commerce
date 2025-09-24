import React, { useState, useEffect } from 'react';
import {
    Box, Heading, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
    IconButton, HStack, Spinner, Text, Flex, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Icon
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { FiArrowLeft } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import { logActivity } from '../services/logService'; // Importe o serviço de log

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        setLoading(true);
        api.get('/products?_sort=id&_order=desc')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => console.error("Erro ao buscar produtos:", error))
            .finally(() => setLoading(false));
    };

    const handleOpenDeleteModal = (product) => {
        setProductToDelete(product);
        onOpen();
    };

    const handleDelete = () => {
        if (productToDelete) {
            api.delete(`/products/${productToDelete.id}`)
                .then(() => {
                    // Registra a atividade de exclusão
                    logActivity(`Produto "${productToDelete.name}" (ID: ${productToDelete.id}) foi excluído.`);
                    fetchProducts();
                })
                .catch(error => {
                    console.error("Erro ao excluir produto:", error);
                })
                .finally(() => {
                    onClose();
                    setProductToDelete(null);
                });
        }
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" height="60vh">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <HStack>
                    <IconButton
                        as={RouterLink}
                        to="/admin"
                        icon={<Icon as={FiArrowLeft} />}
                        aria-label="Voltar ao painel"
                        variant="ghost"
                    />
                    <Heading as="h1" size="xl" color="blue.800">Gerenciar Produtos</Heading>
                </HStack>
                <Button
                    as={RouterLink}
                    to="/admin/products/add"
                    colorScheme="blue"
                    leftIcon={<AddIcon />}
                >
                    Adicionar Produto
                </Button>
            </Flex>

            <TableContainer bg="white" borderRadius="lg" boxShadow="lg">
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
                            <Tr key={product.id} _hover={{ bg: 'gray.50' }}>
                                <Td>{product.id}</Td>
                                <Td fontWeight="medium">{product.name}</Td>
                                <Td>{product.category}</Td>
                                <Td isNumeric>R$ {parseFloat(product.price).toFixed(2)}</Td>
                                <Td isNumeric>{product.stock}</Td>
                                <Td>
                                    <HStack spacing={2}>
                                        <IconButton
                                            aria-label="Editar produto"
                                            icon={<EditIcon />}
                                            colorScheme="blue"
                                            variant="ghost"
                                            as={RouterLink}
                                            to={`/admin/products/edit/${product.id}`}
                                        />
                                        <IconButton
                                            aria-label="Excluir produto"
                                            icon={<DeleteIcon />}
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => handleOpenDeleteModal(product)}
                                        />
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmar Exclusão</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Tem certeza que deseja excluir o produto?</Text>
                        <Text fontWeight="bold" mt={2}>{productToDelete?.name}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme="red" onClick={handleDelete}>
                            Excluir
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default AdminPage;

