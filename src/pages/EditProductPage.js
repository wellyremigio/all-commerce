import { useState, useEffect } from 'react';
import {
    Box, Heading, FormControl, FormLabel, Input, Button, VStack, Textarea,
    NumberInput, NumberInputField, Spinner, Flex, Container, HStack, Icon,
    InputGroup, InputLeftElement, useToast
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiTag, FiGrid, FiDollarSign, FiArchive, FiImage } from 'react-icons/fi';
import api from '../services/api';

const EditProductPage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState(0);
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(true);

    const { productId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        api.get(`/products/${productId}`)
            .then(response => {
                const product = response.data;
                setName(product.name);
                setPrice(product.price);
                setCategory(product.category);
                setDescription(product.description);
                setStock(product.stock || 0);
                setImage(product.image);
            })
            .catch(error => console.error("Erro ao buscar produto:", error))
            .finally(() => setLoading(false));
    }, [productId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedProduct = {
            name,
            price: parseFloat(price),
            category,
            description,
            stock: parseInt(stock, 10),
            image
        };

        api.put(`/products/${productId}`, updatedProduct)
            .then(() => {
                toast({
                    title: 'Produto atualizado!',
                    description: 'As alterações foram salvas com sucesso.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/admin');
            })
            .catch(error => {
                console.error("Erro ao atualizar produto:", error);
                toast({
                    title: 'Erro ao atualizar.',
                    description: 'Não foi possível salvar as alterações.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            });
    };

    if (loading) {
        return <Flex justify="center" align="center" height="60vh"><Spinner size="xl" color="blue.500" /></Flex>;
    }

    return (
        <Container maxW="container.md" py={10}>
            <Heading as="h1" size="xl" mb={8} textAlign="center" color="blue.800">
                Editar Produto
            </Heading>
            <Box bg="white" p={8} borderRadius="lg" boxShadow="lg">
                <form onSubmit={handleSubmit}>
                    <VStack spacing={5}>
                        <FormControl isRequired>
                            <FormLabel>Nome do Produto</FormLabel>
                            <InputGroup>
                                <InputLeftElement children={<Icon as={FiTag} color="gray.400" />} />
                                <Input value={name} onChange={(e) => setName(e.target.value)} />
                            </InputGroup>
                        </FormControl>

                        <HStack width="full" spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Categoria</FormLabel>
                                <InputGroup>
                                    <InputLeftElement children={<Icon as={FiGrid} color="gray.400" />} />
                                    <Input value={category} onChange={(e) => setCategory(e.target.value)} />
                                </InputGroup>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Preço</FormLabel>
                                <InputGroup>
                                    <InputLeftElement children={<Icon as={FiDollarSign} color="gray.400" />} />
                                    <NumberInput value={price} onChange={(valueString) => setPrice(valueString)} min={0} w="full">
                                        <NumberInputField pl={10} />
                                    </NumberInput>
                                </InputGroup>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Estoque</FormLabel>
                                <InputGroup>
                                    <InputLeftElement children={<Icon as={FiArchive} color="gray.400" />} />
                                    <NumberInput value={stock} onChange={(valueString) => setStock(valueString)} min={0} w="full">
                                        <NumberInputField pl={10} />
                                    </NumberInput>
                                </InputGroup>
                            </FormControl>
                        </HStack>

                        <FormControl>
                            <FormLabel>URL da Imagem</FormLabel>
                            <InputGroup>
                                <InputLeftElement children={<Icon as={FiImage} color="gray.400" />} />
                                <Input value={image} onChange={(e) => setImage(e.target.value)} />
                            </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Descrição</FormLabel>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        </FormControl>
                        
                        <HStack width="full" justify="flex-end" mt={4}>
                            <Button variant="ghost" onClick={() => navigate('/admin')}>
                                Cancelar
                            </Button>
                            <Button type="submit" colorScheme="blue">
                                Salvar Alterações
                            </Button>
                        </HStack>
                    </VStack>
                </form>
            </Box>
        </Container>
    );
};

export default EditProductPage;