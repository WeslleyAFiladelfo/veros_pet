const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// Middleware para analisar corpos de solicitação
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Função para converter todos os campos de um objeto para maiúsculas
function convertToUpperCase(obj) {
    const newObj = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'string' ? obj[key].toUpperCase() : obj[key];
        }
    }
    return newObj;
}

// Rota para a página inicial
app.get('/', (req, res) => {
    // Envie o arquivo HTML da página index.html
    res.sendFile(path.join(__dirname, 'menu.html'));
});

// Rota para a página inicial
app.get('/index.html', (req, res) => {
    // Envie o arquivo HTML da página index.html
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para lidar com o envio do formulário
app.post('/salvar_produto', (req, res) => {
    // Extrair os dados do corpo da solicitação e converter para maiúsculas
    const {
        codigo, descricao, desc_resumida, kit, consignado, opme, especie, classe, sub_classe, valor_unitario,
        unidade, curva_abc, serie, registro_anvisa, etiqueta, med_controla, validade, armazenamento_ar_cond,
        armazenamento_geladeira, padronizado, aplicacao, auto_custo, valor, repasse, procedimento_faturamento,
        tipo_atendimento_ps, tipo_atendimento_ambulatorial, tipo_atendimento_internacao, tipo_atendimento_externo,
        tipo_atendimento_todos, observacao, usuario, email
    } = convertToUpperCase(req.body);

    // Configurar o transporte do Nodemailer para o Outlook 365
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: 'cadastros.veros@outlook.com', // E-mail de origem
            pass: 'Veros@123' // Senha do e-mail de origem
        }
    });

    // Configurar o e-mail
    const mailOptions = {
        from: 'cadastros.veros@outlook.com', // E-mail de origem
        to: 'cadastros.veros@outlook.com', // E-mail do destinatário
        subject: 'Solicitação de Cadastro',
        html: `
            <h1>Solicitação de Cadastro:</h1>
            <p><strong>Código:</strong> ${codigo}</p>
            <p><strong>Descrição:</strong> ${descricao}</p>
            <p><strong>Descrição Resumida:</strong> ${desc_resumida}</p>
            <p><strong>Valor de compra unitário:</strong> ${valor_unitario}</p>
            <p><strong>Unidade:</strong> ${unidade}</p>
            <p><strong>Kit:</strong> ${kit}</p>
            <p><strong>Consignado:</strong> ${consignado}</p>
            <p><strong>OPME:</strong> ${opme}</p>
            <p><strong>Espécie:</strong> ${especie}</p>
            <p><strong>Classe:</strong> ${classe}</p>
            <p><strong>Sub-Classe:</strong> ${sub_classe}</p>
            <p><strong>Curva ABC:</strong> ${curva_abc}</p>
            <p><strong>Série:</strong> ${serie}</p>
            <p><strong>Registro ANVISA:</strong> ${registro_anvisa}</p>
            <p><strong>Etiqueta:</strong> ${etiqueta}</p>
            <p><strong>Medicamento controlado:</strong> ${med_controla}</p>
            <p><strong>Validade do produto:</strong> ${validade}</p>
            <p><strong>Ar Condicionado:</strong> ${armazenamento_ar_cond}</p>
            <p><strong>Geladeira:</strong> ${armazenamento_geladeira}</p>
            <p><strong>Padronizado:</strong> ${padronizado}</p>
            <p><strong>Aplicação:</strong> ${aplicacao}</p>
            <p><strong>Alto custo:</strong> ${auto_custo}</p>
            <p><strong>Valor de venda:</strong> ${valor}</p>
            <p><strong>Repasse:</strong> ${repasse}</p>
            <p><strong>Procedimento de Faturamento:</strong> ${procedimento_faturamento}</p>
            <h3>Tipo de Atendimento:</h3>
            <p><strong>PS:</strong> ${tipo_atendimento_ps}</p>
            <p><strong>Ambulatorial:</strong> ${tipo_atendimento_ambulatorial}</p>
            <p><strong>Internação:</strong> ${tipo_atendimento_internacao}</p>
            <p><strong>Externo:</strong> ${tipo_atendimento_externo}</p>
            <p><strong>Todos:</strong> ${tipo_atendimento_todos}</p>
            <p><strong>Observação:</strong> ${observacao}</p>
            <p><strong>Usuário:</strong> ${usuario}</p>
            <p><strong>Email:</strong> ${email}</p>
        `
    };

    // Enviar e-mail
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.status(500).send('Erro ao enviar e-mail');
        } else {
            console.log('E-mail enviado: ' + info.response);
            res.send('Produto cadastrado com sucesso!');
        }
    });
});

// Nova rota para responder o email
app.post('/responder_email', (req, res) => {
    const { from, to, cc, subject, message } = convertToUpperCase(req.body);

    // Configurar o transporte do Nodemailer para o Outlook 365
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: 'cadastrosmv@veros.com', // E-mail de origem
            pass: 'Veros@123' // Senha do e-mail de origem
        }
    });

    // Configurar o e-mail de resposta
    const mailOptions = {
        from: from || 'cadastros.veros@outlook.com', // E-mail de origem, usa padrão se não fornecido
        to: to, // E-mail do destinatário
        cc: cc, // E-mails em cópia
        subject: subject,
        text: message
    };

    // Enviar e-mail de resposta
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.status(500).send('Erro ao enviar e-mail de resposta');
        } else {
            console.log('E-mail de resposta enviado: ' + info.response);
            res.send('E-mail de resposta enviado com sucesso!');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
