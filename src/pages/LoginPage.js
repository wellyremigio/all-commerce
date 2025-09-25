import { useState } from 'react';
import {
    Box, Heading, FormControl, FormLabel, Input, Button, VStack,
    Container, useToast, InputGroup, InputRightElement, Icon, Text
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../services/api';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get(`/users?email=${email}`);
            const user = response.data[0];

            if (user && user.password === password) {
                onLogin(user);
                toast({
                    title: 'Login bem-sucedido!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                navigate(user.role === 'admin' ? '/admin' : '/');
            } else {
                toast({
                    title: 'Erro de Autenticação',
                    description: 'Email ou senha inválidos.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Erro no login:", error);
            toast({
                title: 'Erro de Conexão',
                description: 'Não foi possível conectar ao servidor.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Container centerContent>
            <Box w="100%" maxW="400px" bg="white" p={8} borderRadius="lg" boxShadow="lg" mt={20}>
                <Heading as="h1" size="lg" textAlign="center" mb={8} color="blue.800">
                    Login
                </Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={5}>
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Senha</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputRightElement>
                                    <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                                        <Icon as={showPassword ? FiEyeOff : FiEye} />
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Button type="submit" colorScheme="blue" width="full" size="lg">
                            Entrar
                        </Button>
                    </VStack>
                </form>

                <Text mt={6} textAlign="center">
                    Não tem uma conta?{' '}
                    <Button as={RouterLink} to="/register" colorScheme="blue" variant="link">
                        Cadastre-se
                    </Button>
                </Text>
            </Box>
        </Container>
    );
};

export default LoginPage;