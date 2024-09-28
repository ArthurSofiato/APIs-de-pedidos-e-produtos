const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

let listaProdutos = [];
let listaPedidos = [];
let idProdutoCounter = 1;
let idPedidoCounter = 1;

//Endpoints da API de Produtos

//Cadastro de Produtos
app.post('/produtos', (req, res) => {
    const requiredFields = ['nome', 'descricao', 'valor', 'qtdestoque', 'validade'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        res.status(400).json({ message: `Erro: Os seguintes campos são obrigatórios: ${missingFields.join(', ')}` });
    } else {
        const novoProduto = {
            id: idProdutoCounter++,
            nome: req.body.nome,
            descricao: req.body.descricao,
            valor: req.body.valor,
            qtdestoque: req.body.qtdestoque,
            validade: req.body.validade
        };
        listaProdutos.push(novoProduto);
        res.status(201).json({ message: 'Novo produto cadastrado!' });
    }
});

//Consulta de Produto por ID
app.get('/produtos/:id', (req, res) => {
    const produtoEncontrado = listaProdutos.find(produto => produto.id === parseInt(req.params.id));
    if (!produtoEncontrado) {
        res.status(404).json({ message: 'Produto não encontrado' });
    } else {
        res.json(produtoEncontrado);
    }
});

//Listagem de Produtos  com Paginacao
app.get('/produtos', (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const produtosPaginados = listaProdutos.slice((page - 1) * limit, page * limit);
    res.json({
        page: parseInt(page),
        limit: parseInt(limit),
        total: listaProdutos.length,
        produtos: produtosPaginados
    });
});

//Atualização de Dados do Produto
app.put('/produtos/:id', (req, res) => {
    const produtoIndex = listaProdutos.findIndex(produto => produto.id === parseInt(req.params.id));
    if (produtoIndex === -1) {
        res.status(404).json({ message: 'Produto não encontrado' });
    } else {
        const produtoAtualizado = {
            ...listaProdutos[produtoIndex],
            nome: req.body.nome || listaProdutos[produtoIndex].nome,
            descricao: req.body.descricao || listaProdutos[produtoIndex].descricao,
            valor: req.body.valor || listaProdutos[produtoIndex].valor,
            qtdestoque: req.body.qtdestoque || listaProdutos[produtoIndex].qtdestoque,
            validade: req.body.validade || listaProdutos[produtoIndex].validade
        };
        listaProdutos[produtoIndex] = produtoAtualizado;
        res.json({ message: 'Produto atualizado com sucesso!' });
    }
});

//Exclusão de Produto
app.delete('/produtos/:id', (req, res) => {
    const produtoIndex = listaProdutos.findIndex(produto => produto.id === parseInt(req.params.id));
    if (produtoIndex === -1) {
        res.status(404).json({ message: 'Produto não encontrado' });
    } else {
        listaProdutos.splice(produtoIndex, 1);
        res.json({ message: 'Produto excluído com sucesso!' });
    }
});

//API de Pedidos

//Criação de Pedidos
app.post('/pedidos', (req, res) => {
    const requiredFields = ['produtos', 'endereco', 'cliente'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        res.status(400).json({ message: `Erro: Os seguintes campos são obrigatórios: ${missingFields.join(', ')}` });
    } else {
        const novoPedido = {
            id: idPedidoCounter++,
            produtos: req.body.produtos,
            endereco: req.body.endereco,
            cliente: req.body.cliente,
            status: 'pendente'
        };
        listaPedidos.push(novoPedido);
        res.status(201).json({ message: 'Novo pedido criado!' });
    }
});

//Consulta de Pedido por ID
app.get('/pedidos/:id', (req, res) => {
    const pedidoEncontrado = listaPedidos.find(pedido => pedido.id === parseInt(req.params.id));
    if (!pedidoEncontrado) {
        res.status(404).json({ message: 'Pedido não encontrado' });
    } else {
        res.json(pedidoEncontrado);
    }
});

//Listagem de Pedidos
app.get('/pedidos', (req, res) => {
    const { status } = req.query;
    const pedidosFiltrados = status ? listaPedidos.filter(pedido => pedido.status === status) : listaPedidos;
    res.json({
        total: pedidosFiltrados.length,
        pedidos: pedidosFiltrados
    });
});

//Atualização de Status do Pedido
app.put('/pedidos/:id/status', (req, res) => {
    const pedidoIndex = listaPedidos.findIndex(pedido => pedido.id === parseInt(req.params.id));
    if (pedidoIndex === -1) {
        res.status(404).json({ message: 'Pedido não encontrado' });
    } else {
        listaPedidos[pedidoIndex].status = req.body.status || listaPedidos[pedidoIndex].status;
        res.json({ message: 'Status do pedido atualizado com sucesso!' });
    }
});//colocar no json: "status": "(o que vc quiser)"

//Exclusão de Pedido
app.delete('/pedidos/:id', (req, res) => {
    const pedidoIndex = listaPedidos.findIndex(pedido => pedido.id === parseInt(req.params.id));
    if (pedidoIndex === -1) {
        res.status(404).json({ message: 'Pedido não encontrado' });
    } else {
        listaPedidos.splice(pedidoIndex, 1);
        res.json({ message: 'Pedido excluído com sucesso!' });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
     console.log(`Servidor rodando na porta ${PORT}`);
});