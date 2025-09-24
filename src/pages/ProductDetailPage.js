// src/pages/ProductDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
    Box, Heading, Text, Image, Button, Spinner, Flex, Badge, Icon,
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, SimpleGrid,
    Input, HStack, VStack, Radio, RadioGroup, Divider, useToast
} from '@chakra-ui/react';
import { FiShoppingCart, FiChevronRight, FiTruck } from 'react-icons/fi';
import api from '../services/api';

const ProductDetailPage = ({ onAddToCart }) => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [cep, setCep] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);
    const [shippingOptions, setShippingOptions] = useState([]);
    const toast = useToast();

    useEffect(() => {
        setLoading(true);
        api.get(`/products/${id}`)
            .then(response => setProduct(response.data))
            .catch(error => console.error("Erro ao buscar detalhes do produto:", error))
            .finally(() => setLoading(false));
    }, [id]);

    const handleCalculateShipping = () => {
        const cleanedCep = cep.replace(/\D/g, '');
        if (cleanedCep.length !== 8) {
            toast({
                title: 'CEP inválido',
                description: 'Por favor, digite um CEP com 8 dígitos.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsCalculating(true);
        setShippingOptions([]);

        setTimeout(() => {
            const options = [
                { name: 'Retirada na Loja (UFCG - Campina Grande)', price: 0, deliveryTime: 'Imediato' },
                { name: 'Correios (PAC)', price: 22.50, deliveryTime: '7 dias úteis' },
                { name: 'Correios (SEDEX)', price: 45.80, deliveryTime: '3 dias úteis' },
                { name: 'Transportadora Paraíba Express', price: 35.00, deliveryTime: '4 dias úteis' }
            ];
            setShippingOptions(options);
            setIsCalculating(false);
        }, 1000);
    };

    if (loading) {
        return <Flex justify="center" align="center" height="60vh"><Spinner size="xl" /></Flex>;
    }

    if (!product) {
        return <Text textAlign="center">Produto não encontrado.</Text>;
    }

    return (
        <Box maxW="container.xl" mx="auto" p={5}>
            <Breadcrumb spacing="8px" separator={<Icon as={FiChevronRight} color="gray.500" />}>
                <BreadcrumbItem><BreadcrumbLink as={RouterLink} to="/">Início</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbItem><BreadcrumbLink as={RouterLink} to="/">{product.category}</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbItem isCurrentPage><BreadcrumbLink href="#">{product.name}</BreadcrumbLink></BreadcrumbItem>
            </Breadcrumb>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mt={6}>
                <Image
                    src={product.image || `https://placehold.co/600x600?text=${product.name}`}
                    alt={product.name}
                    borderRadius="lg"
                    objectFit="cover"
                    boxShadow="lg"
                />
                <Flex direction="column" justify="center">
                    <Badge colorScheme="blue" w="fit-content" mb={2}>{product.category}</Badge>
                    <Heading as="h1" size="2xl" mb={4}>{product.name}</Heading>
                    <Text fontSize="lg" color="gray.600" mb={6}>{product.description}</Text>
                    
                    {/* Exibe o estoque disponível */}
                    <Text mb={6} color={product.stock > 0 ? 'green.600' : 'red.600'}>
                        {product.stock > 0 ? `Estoque: ${product.stock} unidades` : 'Produto esgotado'}
                    </Text>

                    <Text fontWeight="bold" fontSize="4xl" color="blue.600" mb={8}>
                        R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
                    </Text>
                    
                    {/* LÓGICA DE ESTOQUE NO BOTÃO */}
                    <Button
                        leftIcon={<Icon as={FiShoppingCart} />}
                        colorScheme={product.stock > 0 ? "blue" : "gray"}
                        size="lg"
                        onClick={() => onAddToCart(product)}
                        isDisabled={product.stock === 0}
                    >
                        {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
                    </Button>

                    <Box mt={8} p={5} borderWidth="1px" borderRadius="md">
                        <HStack mb={4}>
                            <Icon as={FiTruck} w={6} h={6} color="gray.600" />
                            <Heading size="md">Calcular frete e entrega</Heading>
                        </HStack>
                        <HStack>
                            <Input
                                placeholder="Digite seu CEP"
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                maxLength={9}
                            />
                            <Button
                                colorScheme="blue"
                                onClick={handleCalculateShipping}
                                isLoading={isCalculating}
                            >
                                Calcular
                            </Button>
                        </HStack>

                        {shippingOptions.length > 0 && (
                            <VStack align="stretch" mt={4}>
                                <Divider />
                                <RadioGroup>
                                    {shippingOptions.map(option => (
                                        <Radio key={option.name} value={option.name} my={2} w="full">
                                            <Flex justify="space-between" w="full">
                                                <Box>
                                                    <Text>{option.name}</Text>
                                                    <Text fontSize="sm" color="gray.500">Prazo: {option.deliveryTime}</Text>
                                                </Box>
                                                <Text fontWeight="bold">
                                                    {option.price === 0 ? 'Grátis' : `R$ ${option.price.toFixed(2)}`}
                                                </Text>
                                            </Flex>
                                        </Radio>
                                    ))}
                                </RadioGroup>
                            </VStack>
                        )}
                    </Box>
                </Flex>
            </SimpleGrid>
        </Box>
    );
};

export default ProductDetailPage;