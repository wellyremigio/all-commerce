# All Commerce
Este é um projeto de uma Loja Virtual para Comércio em Geral, desenvolvido para a disciplina Programação para Web I, do curso de Ciência da Computação - UFCG. O objetivo é criar uma plataforma de e-commerce funcional que permita a venda de produtos diversos, tanto físicos quanto digitais, de lojas de uma cidade. 

## Desenvolvedoras
Welly Remígio Bezerra

Karyna Vanessa Matias Araújo 


## Funcionalidades
A plataforma implementa as seguintes funcionalidades principais:
- Gestão de Catálogo: Visualização de produtos com filtros dinâmicos por categoria. 
- Carrinho de Compras: Adição e remoção de produtos, com controle de quantidade. 
- Checkout Simulado: Um fluxo de checkout simples e responsivo, incluindo cálculo simulado de frete e impostos. 
- Opções de Pagamento: Interface simulada para pagamentos com Cartão de Crédito e PIX. 
- Gerenciamento de Produtos (Admin): Painel administrativo para cadastrar, ler, atualizar e excluir produtos. 
- Gestão de Pedidos:
  - Painel para o administrador acompanhar os pedidos realizados. 
  - Área do cliente ("Meus Pedidos") para visualização do histórico de compras.
- Distribuição Simulada: Lógica para lidar com diferentes métodos de entrega, como retirada no local, e entrega de produtos digitais com link para download. 

## Tecnologias Utilizadas
- Frontend: React
- UI/Estilização: Chakra UI
- Backend (Simulado): json-server
- Comunicação com API: Axios

## Como Rodar o Projeto?

Pré-requisitos
- Node.js 
- json-server instalado globalmente (``npm install -g json-server``)

### Backend (API Falsa) - Precisa ser executado em um terminal separado.

Navegue até a pasta raiz do projeto (onde está o db.json)

``cd .\all-commerce\``

Inicie o servidor na porta 3001

``json-server --watch db.json --port 3001``

### Frontend - Abra outro terminal

Navegue até a pasta raiz do projeto (onde está o db.json)

``cd .\all-commerce\``

Instale todas as dependências

``npm install``

Inicie a aplicação
``npm start``

A aplicação será aberta no seu navegador.


## Credenciais de Acesso (Simulado)
- Para entrar como Admin:
  
  Email: ``admin@allcommerce.com``
  
  Senha: ``admin``

- Para entrar como Cliente:
  
  Email: ``cliente@email.com``

  Senha: ``123``

