import React, { useState } from 'react';
import {
  Box, Heading, FormControl, FormLabel, Input, Button, VStack, Textarea, NumberInput, NumberInputField
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddProductPage = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const newProduct = {
      name,
      price: parseFloat(price),
      category,
      description,
      stock: parseInt(stock, 10),
      image: image || 'https://via.placeholder.com/400x400.png?text=Novo+Produto'
    };

    api.post('/products', newProduct)
      .then(() => {
        alert('Produto cadastrado com sucesso!');
        navigate('/admin'); // Redireciona para a lista de produtos
      })
      .catch(error => {
        console.error("Erro ao cadastrar produto:", error);
        alert('Ocorreu um erro ao cadastrar o produto.');
      });
  };

  return (
    <Box maxW="600px" mx="auto">
      <Heading as="h1" size="xl" mb={6}>Cadastrar Novo Produto</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Nome do Produto</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Categoria</FormLabel>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Preço</FormLabel>
            <NumberInput value={price} onChange={(valueString) => setPrice(valueString)}>
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Estoque</FormLabel>
            <NumberInput value={stock} onChange={(valueString) => setStock(valueString)}>
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel>URL da Imagem</FormLabel>
            <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Deixe em branco para usar uma imagem padrão" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Descrição</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
          <Button type="submit" colorScheme="teal" size="lg" width="full">
            Cadastrar Produto
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddProductPage;