import { useState, useEffect } from 'react';
import {
    Box, Heading, Spinner, Text, Table, Thead, Tbody, Tr, Th, Td,
    TableContainer, IconButton, HStack, Select, useToast, Flex
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import api from '../services/api';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        api.get('/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error("Erro ao buscar usuários:", error))
            .finally(() => setLoading(false));
    };

    const handleRoleChange = (userId, newRole) => {
        api.patch(`/users/${userId}`, { role: newRole })
            .then(() => {
                toast({
                    title: "Perfil atualizado!",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
                fetchUsers();
            })
            .catch(error => console.error("Erro ao atualizar perfil:", error));
    };

    const handleDelete = (userId) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            api.delete(`/users/${userId}`)
                .then(() => {
                    toast({
                        title: "Usuário excluído!",
                        status: 'info',
                        duration: 2000,
                        isClosable: true,
                    });
                    fetchUsers();
                })
                .catch(error => console.error("Erro ao excluir usuário:", error));
        }
    };

    if (loading) return <Flex justify="center" align="center" height="60vh"><Spinner size="xl" /></Flex>;

    return (
        <Box>
            <Heading as="h1" size="xl" mb={6}>Gerenciar Usuários</Heading>
            <TableContainer bg="white" borderRadius="lg" boxShadow="md">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Email</Th>
                            <Th>Perfil</Th>
                            <Th>Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users.map(user => (
                            <Tr key={user.id}>
                                <Td>{user.id}</Td>
                                <Td>{user.email}</Td>
                                <Td>
                                    <Select
                                        size="sm"
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        maxW="150px"
                                    >
                                        <option value="customer">Cliente</option>
                                        <option value="admin">Admin</option>
                                    </Select>
                                </Td>
                                <Td>
                                    <IconButton
                                        aria-label="Excluir usuário"
                                        icon={<DeleteIcon />}
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => handleDelete(user.id)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminUsersPage;