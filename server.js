const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// Middleware para analisar corpos de solicitação
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página inicial
app.get('/', (req, res) => {
    // Envie o arquivo HTML da página index.html
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para lidar com o envio do formulário
app.post('/salvar_produto', (req, res) => {
    // Extrair os dados do corpo da solicitação
    const { codigo, descricao, desc_resumida, kit, consignado, opme, especie, classe, sub_classe } = req.body;

    // Configurar o transporte do Nodemailer para o Outlook 365
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: 'cadastro_pet@outlook.com', // E-mail de origem
            pass: 'Gic@29098' // Senha do e-mail de origem
        }
    });

    // Configurar o e-mail
    const mailOptions = {
        from: 'cadastro_pet@outlook.com', // E-mail de origem
        to: 'cadastro_pet@outlook.com', // E-mail do destinatário
        subject: 'Novo produto cadastrado',
        html: `
            <h1>Novo produto cadastrado:</h1>
            <p><strong>Código:</strong> ${codigo}</p>
            <p><strong>Descrição:</strong> ${descricao}</p>
            <p><strong>Descrição Resumida:</strong> ${desc_resumida}</p>
            <p><strong>Kit:</strong> ${kit}</p>
            <p><strong>Consignado:</strong> ${consignado}</p>
            <p><strong>OPME:</strong> ${opme}</p>
            <p><strong>Espécie:</strong> ${especie}</p>
            <p><strong>Classe:</strong> ${classe}</p>
            <p><strong>Sub-Classe:</strong> ${sub_classe}</p>
        `
    };

    // Enviar e-mail
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.send('Erro ao enviar e-mail');
        } else {
            console.log('E-mail enviado: ' + info.response);
            res.send('Produto cadastrado com sucesso!');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
