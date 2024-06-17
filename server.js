const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function convertToUpperCase(obj) {
    const newObj = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = Array.isArray(obj[key])
                ? obj[key].map(item => (typeof item === 'string' ? item.toUpperCase() : item))
                : typeof obj[key] === 'string'
                ? obj[key].toUpperCase()
                : obj[key];
        }
    }
    return newObj;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'menu.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/salvar_produto', (req, res) => {
    const formData = convertToUpperCase(req.body);
    const {
        cadastro_urgente,codigo, kit, consignado, opme, especie, classe, sub_classe, unidade, curva_abc, serie,
        registro_anvisa, etiqueta, med_controla, validade, armazenamento_ar_cond, armazenamento_geladeira,
        padronizado, sn_movimentacao, sn_bloqueio_de_compras, aplicacao, auto_custo, valor, repasse,
        procedimento_faturamento, tipo_atendimento_ps, tipo_atendimento_ambulatorial, tipo_atendimento_internacao,
        tipo_atendimento_externo, tipo_atendimento_todos, observacao, usuario, email, email_cc
    } = formData;

    const descricoes = formData.descricao || [];
    const desc_resumidas = formData.desc_resumida || [];
    const valores_unitarios = formData.valor_unitario || [];
    const marcas1 = formData.LAB_PRO_1 || [];
    const marcas2 = formData.LAB_PRO_2 || [];
    const marcas3 = formData.LAB_PRO_3 || [];

    let descricoesHtml = '';
    for (let i = 0; i < descricoes.length; i++) {
        descricoesHtml += `
            <p><strong>Descrição ${i + 1}:</strong> ${descricoes[i]}</p>
            <p><strong>Descrição Resumida ${i + 1}:</strong> ${desc_resumidas[i]}</p>
            <p><strong>Valor Unitário ${i + 1}:</strong> ${valores_unitarios[i]}</p>
            <p><strong>Marcas 1 - ${i + 1}:</strong> ${marcas1[i]}</p>
            <p><strong>Marcas 2 - ${i + 1}:</strong> ${marcas2[i]}</p>
            <p><strong>Marcas 3 - ${i + 1}:</strong> ${marcas3[i]}</p>
        `;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: 'cadastrosveros@outlook.com',
            pass: 'Veros@1234'
        },
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false // Permite conexões a servidores com certificados autoassinados
        }
    });

    const mailOptions = {
        from: 'cadastrosveros@outlook.com',
        to: 'cadastrosveros@outlook.com',
        subject: 'Solicitação de Cadastro',
        html: `
            <h1>Solicitação de Cadastro:</h1>
            <p><strong>Cadastro de Urgência:</strong> ${cadastro_urgente}</p>
            ${codigo ? `<p><strong>Código:</strong> ${codigo}</p>` : ''}
            ${descricoesHtml}
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
            <p><strong>Movimentação:</strong> ${sn_movimentacao}</p>
            <p><strong>Bloq. Compras:</strong> ${sn_bloqueio_de_compras}</p>
            <h3>Precificação:</h3>
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
            <p><strong>Com cópia:</strong> ${email_cc}</p>
        `
    };

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

app.post('/responder_email', (req, res) => {
    const { from, to, cc, subject, message } = convertToUpperCase(req.body);

    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: 'cadastrosveros@outlook.com',
            pass: 'Veros@1234'
        },
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false // Permite conexões a servidores com certificados autoassinados
        }
    });

    const mailOptions = {
        from: from || 'cadastrosveros@outlook.com',
        to: to,
        cc: cc,
        subject: subject,
        text: message
    };

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
