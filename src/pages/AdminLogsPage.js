import { useState, useEffect } from 'react';
import {
    Box, Heading, Spinner, Text, Table, Thead, Tbody, Tr, Th, Td,
    TableContainer, Flex, Icon, HStack, IconButton
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api';

const AdminLogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get('/logs?_sort=timestamp&_order=desc')
            .then(response => setLogs(response.data))
            .catch(error => console.error("Erro ao buscar logs:", error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Flex justify="center" align="center" height="60vh"><Spinner size="xl" /></Flex>;

    return (
        <Box>
            <HStack mb={6}>
                <IconButton
                    as={RouterLink}
                    to="/admin"
                    icon={<Icon as={FiArrowLeft} />}
                    aria-label="Voltar ao painel"
                    variant="ghost"
                />
                <Heading as="h1" size="xl" color="blue.800">Logs de Atividade</Heading>
            </HStack>
            <TableContainer bg="white" borderRadius="lg" boxShadow="lg">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Data e Hora</Th>
                            <Th>Descrição da Atividade</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {logs.map(log => (
                            <Tr key={log.id}>
                                <Td>{new Date(log.timestamp).toLocaleString('pt-BR')}</Td>
                                <Td>{log.description}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminLogsPage;