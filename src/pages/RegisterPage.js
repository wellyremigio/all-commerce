// src/pages/RegisterPage.js

import React, { useState } from 'react';
import {
    Box, Heading, FormControl, FormLabel, Input, Button, VStack,
    Container, useToast, InputGroup, InputRightElement, Icon, Text
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const existingUserResponse = await api.get(`/users?email=${email}`);
            if (existingUserResponse.data.length > 0) {
                toast({
                    title: 'Email já cadastrado.',
                    description: 'Por favor, use um email diferente ou faça login.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            const newUser = {
                email,
                password,
                role: 'customer'
            };

            const response = await api.post('/users', newUser);
            const createdUser = response.data;

            toast({
                title: 'Cadastro realizado com sucesso!',
                description: 'Você já está logado.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            onLogin(createdUser);
            navigate('/');

        } catch (error) {
            console.error("Erro no cadastro:", error);
            toast({
                title: 'Erro no Cadastro',
                description: 'Não foi possível criar sua conta. Tente novamente.',
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
                    Crie sua Conta
                </Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={5}>
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Senha</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Crie uma senha forte"
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
                            Cadastrar
                        </Button>
                    </VStack>
                </form>
                <Text mt={6} textAlign="center">
                    Já tem uma conta?{' '}
                    <Button as={RouterLink} to="/login" colorScheme="blue" variant="link">
                        Faça login
                    </Button>
                </Text>
            </Box>
        </Container>
    );
};

export default RegisterPage;