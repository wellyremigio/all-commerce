import { Box, Heading, SimpleGrid, Icon, Text, VStack, Flex } from '@chakra-ui/react';
import { FiBox, FiClipboard, FiUsers, FiFileText } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const NavCard = ({ to, icon, title, description }) => (
    <Flex
        as={RouterLink}
        to={to}
        p={6}
        bg="white"
        borderRadius="lg"
        boxShadow="md"
        align="center"
        transition="all 0.2s"
        _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg', textDecoration: 'none' }}
    >
        <Icon as={icon} w={10} h={10} color="blue.500" />
        <Box ml={4}>
            <Heading size="md">{title}</Heading>
            <Text color="gray.600">{description}</Text>
        </Box>
    </Flex>
);

const AdminDashboard = () => {
    return (
        <Box>
            <VStack spacing={4} mb={10} textAlign="center">
                <Heading as="h1" size="2xl" color="blue.800">Painel Administrativo</Heading>
                <Text fontSize="lg" color="gray.600">Selecione uma opção para gerenciar a loja.</Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} maxW="container.xl" mx="auto">
                <NavCard
                    to="/admin/products"
                    icon={FiBox}
                    title="Gerenciar Produtos"
                    description="Adicione, edite ou remova produtos."
                />
                <NavCard
                    to="/admin/orders"
                    icon={FiClipboard}
                    title="Gerenciar Pedidos"
                    description="Acompanhe o status dos pedidos."
                />
                <NavCard
                    to="/admin/users"
                    icon={FiUsers}
                    title="Gerenciar Usuários"
                    description="Altere perfis e administre contas."
                />
                <NavCard
                    to="/admin/logs"
                    icon={FiFileText}
                    title="Logs de Atividade"
                    description="Visualize o registro de ações."
                />
            </SimpleGrid>
        </Box>
    );
};

export default AdminDashboard;