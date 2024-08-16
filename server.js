const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Dados de exemplo (substitua com seus dados reais)

const especieClasseMapping = {
  1: {
    "DROGAS E MEDICAMENTOS": [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "AGENTES DIAGNOSTICOS" },
      { codigo: 2, descricao: "FARMACOS DIVERSOS" },
      { codigo: 3, descricao: "AGENTES ANTINEOPLASICOS" },
      { codigo: 4, descricao: "ANTIINFECCIOSOS" },
      { codigo: 5, descricao: "AGENTES ANTINEOPLASICOS" },
      { codigo: 6, descricao: "ANTI-REUMATICOS E ANTIGOTOSOS" },
      { codigo: 7, descricao: "SISTEMA CARDIOVASCULAR" },
      { codigo: 8, descricao: "SISTEMA DIGESTORIO" },
      { codigo: 9, descricao: "SISTEMA RESPIRATORIO" },
      { codigo: 10, descricao: "ESPASMOLITICOS" },
      { codigo: 11, descricao: "HORMONIOS E ANTI-HORMONIOS" },
      { codigo: 12, descricao: "IMUNOLOGIA E ALERGOLOGIA" },
      { codigo: 13, descricao: "MEDICINA NUCLEAR" },
      { codigo: 14, descricao: "METABOLISMO E NUTRICAO" },
      { codigo: 15, descricao: "MIORRELAXANTES" },
      { codigo: 16, descricao: "OLHOS E ANEXOS" },
      { codigo: 17, descricao: "OUVIDO E ANEXOS" },
      { codigo: 18, descricao: "PELE E MUCOSAS" },
      { codigo: 19, descricao: "SANGUE E SISTEMA HEMATOPOETICO" },
      { codigo: 20, descricao: "SISTEMA NERVOSO CENTRAL" },
      { codigo: 21, descricao: "SISTEMA NERVOSO PERIFERICO" },
      { codigo: 22, descricao: "AGENTES IMUNIZANTES" },
      { codigo: 23, descricao: "ANTIALERGICOS" },
      { codigo: 24, descricao: "ANTISSEPTICOS" },
      { codigo: 25, descricao: "CONTRASTES RADIOLOGICOS" },
      { codigo: 26, descricao: "DERMATOLOGICOS" },
      { codigo: 27, descricao: "DIURETICOS OSMOTICOS" },
      { codigo: 28, descricao: "ELETROLITOS" },
      { codigo: 29, descricao: "FARMACOS INTERF METAB DA AGUA" },
      { codigo: 30, descricao: "OFTALMICOS, OTOLOG, NASOFARINGE" },
      { codigo: 31, descricao: "SISTEMA ANALGESIA E ANESTESIA" },
      { codigo: 32, descricao: "SISTEMA ANTIMICROBIANO" },
      { codigo: 33, descricao: "SISTEMA NEUROLOGIA PSIQUIATRIA" },
      { codigo: 34, descricao: "VITAMINAS" },
      { codigo: 35, descricao: "SUPLEMENTOS" },
      { codigo: 36, descricao: "ANTICORPO MONOCLONAL" },
      // Adicione outras classes conforme necessário
    ],
  },
  2: {
    "MATERIAL MEDICO HOSPITALAR": [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "MATERIAL MEDICO" },
      { codigo: 2, descricao: "MATERIAL DE LABORATORIO" },
      { codigo: 3, descricao: "MATERIAL DE DIAGNOSTICO" },
      { codigo: 4, descricao: "ADESIVOS/CURATIVOS/HEMOSTATICOS" },
      { codigo: 5, descricao: "CANULAS/DRENOS/SONDAS/TUBOS" },
      { codigo: 6, descricao: "DESCARTAVEIS" },
      { codigo: 7, descricao: "INFUSAO/PERFUROCORTANTE" },
      { codigo: 8, descricao: "LATEX" },
      { codigo: 9, descricao: "ODONTOLOGICOS" },
      { codigo: 11, descricao: "PRODUTOS QUIMICOS" },
      { codigo: 12, descricao: "SUTURA CIRURGICA" },
      { codigo: 13, descricao: "TEXTEIS" },
      { codigo: 14, descricao: "USO GERAL" },
      // Adicione outras classes conforme necessário
    ],
  },
  3: {
    PATRIMONIO: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "MATERIAL PERMANENTE" },
      { codigo: 2, descricao: "BENS DE PEQUENOS VALORES" },
      // Adicione outras classes conforme necessário
    ],
  },
  4: {
    "GASES HOSPITALARES": [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "GASES" },
      // Adicione outras classes conforme necessário
    ],
  },
  5: {
    "MATERIAL DE COPA E COZINHA": [
      { codigo: 1, descricao: "MATERIAL DE COPA E COZINHA" },
      // Adicione outras classes conforme necessário
    ],
  },
  6: {
    "GENEROS ALIMENTICIOS": [
      { codigo: 1, descricao: "ALIMENTOS" },
      // Adicione outras classes conforme necessário
    ],
  },
  7: {
    "ORTESE, PROTESE E MAT. ESPECIAL": [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "OPME CIRURGICA" },
      { codigo: 2, descricao: "OPME NAO CIRURGICA" },
      // Adicione outras classes conforme necessário
    ],
  },
  8: {
    "MATERIAL DE MANUTENCAO": [
      { codigo: 1, descricao: "MATERIAL DE MANUTENCAO" },
      // Adicione outras classes conforme necessário
    ],
  },
  9: {
    "MATERIAL DE SEGURANCA": [
      { codigo: 1, descricao: "MATERIAL DE SEGURANCA" },
      // Adicione outras classes conforme necessário
    ],
  },
  10: {
    "MATERIAL DE HIGIENIZACAO": [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 2, descricao: "CAIXA" },
      // Adicione outras classes conforme necessário
    ],
  },
  11: {
    "COMBUSTIVEIS E LUBRIFICANTES": [
      { codigo: 1, descricao: "COMBUSTIVEIS E LUBRIFICANTES" },
      // Adicione outras classes conforme necessário
    ],
  },
  12: {
    "MATERIAIS DE EXPEDIENTE": [
      { codigo: 1, descricao: "MATERIAIS DE EXPEDIENTE" },
      // Adicione outras classes conforme necessário
    ],
  },
  13: {
    "MATERIAL DE ROUPARIA": [
      { codigo: 1, descricao: "MATERIAL DE ROUPARIA" },
      // Adicione outras classes conforme necessário
    ],
  },
  14: {
    "MATERIAL DE LABORATORIO": [
      { codigo: 1, descricao: "MATERIAL DE LABORATORIO" },
      // Adicione outras classes conforme necessário
    ],
  },
  15: {
    "NUTRIENTES ENTERAIS/PARENTERAIS": [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "NUTRIENTES ENTERAIS/PARENTERAIS" },
      // Adicione outras classes conforme necessário
    ],
  },
  16: {
    INSUMOS: [
      { codigo: 1, descricao: "INSUMOS" },
      { codigo: 2, descricao: "USO GERAL" },
      // Adicione outras classes conforme necessário
    ],
  },
  17: {
    HIGIENE: [
      { codigo: 1, descricao: "USO GERAL" },
      // Adicione outras classes conforme necessário
    ],
  },
  18: {
    "MATERIAL CONSUMO": [
      { codigo: 1, descricao: "USO GERAL" },
      // Adicione outras classes conforme necessário
    ],
  },
  19: {
    "MATERIAL DE EMBALAGEM": [
      { codigo: 1, descricao: "USO GERAL" },
      // Adicione outras classes conforme necessário
    ],
  },
  20: {
    "MATERIAL DE ESCRITORIO": [
      { codigo: 1, descricao: "USO GERAL" },
      // Adicione outras classes conforme necessário
    ],
  },
  21: {
    RAÇÃO: [
      { codigo: 1, descricao: "SECA" },
      { codigo: 2, descricao: "UMIDA" },
      { codigo: 3, descricao: "MEDICAMENTOSA" },
      // Adicione outras classes conforme necessário
    ],
  },
  22: {
    BRINDES: [
      { codigo: 1, descricao: "BRINDES DIVERSOS" },
      // Adicione outras classes conforme necessário
    ],
  },
};

const classeSubclasseMapping = {
  1: {
    0: [{ codigo: 0, descricao: "A CLASSIFICAR" }],
    1: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "AMIDOTRIZOATOS" },
      { codigo: 2, descricao: "COMPOSTOS DE GADOLINIO" },
      { codigo: 3, descricao: "METAIS PESADOS" },
      { codigo: 4, descricao: "OLEOS IODADOS" },
      { codigo: 5, descricao: "ANALITOS NA URINA" },
    ],
    2: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 5, descricao: "AUX. DO ABANDONO DO TABAGISMO" },
      { codigo: 6, descricao: "BLOQUEADORES NEUROMUSCULARES" },
      { codigo: 7, descricao: "CORANTES" },
      { codigo: 8, descricao: "FAR. P/ DISF. ERETIL/RET. URIN" },
      { codigo: 9, descricao: "LUBRIFICANTES ARTICULARES" },
      { codigo: 10, descricao: "SOLUCAO CONSERV./IRRIGACAO" },
      { codigo: 11, descricao: "SOLUCOES PARA CARDIOPLEGIA" },
      { codigo: 12, descricao: "ANTIGALACTOGENICOS" },
      { codigo: 13, descricao: "ANTIHEMORRAGICOS" },
      { codigo: 14, descricao: "ANTITOXICOS" },
      { codigo: 15, descricao: "CICATRIZANTES" },
      { codigo: 16, descricao: "DERMATOLOGICOS" },
      { codigo: 17, descricao: "HEPATOPROTETOR" },
      { codigo: 18, descricao: "OTOLOGICOS" },
      { codigo: 19, descricao: "PARASSIMPATOMIMETICO" },
      { codigo: 20, descricao: "PROBIOTICOS" },
      { codigo: 21, descricao: "REGENERADOR ARTICULAR" },
      { codigo: 22, descricao: "VASODILATADOR CEREBRAL E PERIFERICO" },
      { codigo: 23, descricao: "OFTALMICOS" },
      { codigo: 24, descricao: "ANTIINTOXICANTE" },
      { codigo: 25, descricao: "ANTIFUNGICOS" },
      { codigo: 26, descricao: "INODILATADOR" },
      { codigo: 27, descricao: "IMUNOGLOBULINAS" },
      { codigo: 28, descricao: "AGENTES ANTIESCLEROSANTES" },
      { codigo: 29, descricao: "ANTIVERTIGINOSOS" },
      { codigo: 30, descricao: "HIPERLIPIDEMICOS" },
      { codigo: 31, descricao: "SOLUÇÕES P/HEMODIALISE" },
      { codigo: 32, descricao: "ANTICOLINERGICOS" },
    ],
    3: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 12, descricao: "AGENTES ADSORVENTES" },
      { codigo: 13, descricao: "AGENTES QUELANTES" },
      { codigo: 14, descricao: "ANTIDOTOS FARM. ESPECIFICOS" },
      { codigo: 15, descricao: "ANTIDOTO E ANTAGONISTA" },
    ],
    4: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 15, descricao: "ANTIBIOTICOS" },
      { codigo: 16, descricao: "ANTIFUNGICOS" },
      { codigo: 17, descricao: "ANTIINFECCIOSOS URINARIOS" },
      { codigo: 18, descricao: "ANTIPARASITARIOS" },
      { codigo: 19, descricao: "ANTI-SEPTICOS" },
      { codigo: 20, descricao: "ANTIVIRAIS" },
      { codigo: 21, descricao: "SULFONAMIDAS" },
    ],
    5: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "IMUNOSUPRESSOR" },
      { codigo: 22, descricao: "AGENTES DIVERSOS" },
    ],
    6: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "FARMACOS QUE DEBELAM O PROC REUMATICO" },
      { codigo: 23, descricao: "ANTIGOTOSO/ANTI-HIPERURICEMICO" },
      { codigo: 24, descricao: "ANTIINFLAM. NAO ESTEREOIDAL" },
      { codigo: 25, descricao: "ANTIINFLAM. ESTEREOIDAL" },
    ],
    7: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 26, descricao: "ANTIARRITMICOS" },
      { codigo: 27, descricao: "ANTI-HIPERTENSIVOS" },
      { codigo: 28, descricao: "ANTIVARICOSOS" },
      { codigo: 29, descricao: "GLICOSIDEOS DIGITALICOS" },
      { codigo: 30, descricao: "OUTROS FARMACOS INOTROPICOS" },
      { codigo: 31, descricao: "PROSTAGLANDINA E SUBST. RELAC." },
      { codigo: 32, descricao: "VASOCONSTRITORES" },
      { codigo: 33, descricao: "VASODILATADORES" },
      { codigo: 34, descricao: "SIMPATOMIMETICOS E HIPERTENSOR" },
      { codigo: 35, descricao: "ANTIARRITMICOS" },
      { codigo: 36, descricao: "HEMOSTATICOS" },
      { codigo: 37, descricao: "ANTICOAGULANTES E TROMBOLITICO" },
      { codigo: 38, descricao: "INODILATADORES" },
    ],
    8: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 34, descricao: "ANTIACIDOS ASSOCIADOS" },
      { codigo: 35, descricao: "ANTIACIDOS ISOLADOS" },
      { codigo: 36, descricao: "ANTIDIARREICOS" },
      { codigo: 37, descricao: "ANTIEMETICOS" },
      { codigo: 38, descricao: "ANTIULCEROSOS" },
      { codigo: 39, descricao: "CATARTICOS - ESTIMULANTES" },
      { codigo: 40, descricao: "CATARTICOS - FORM. DE MASSA" },
      { codigo: 41, descricao: "CATARTICOS - LUBRIFICANTES" },
      { codigo: 42, descricao: "CATARTICOS - SALINOS" },
      { codigo: 43, descricao: "ENZIMAS DIGESTIVAS" },
      { codigo: 44, descricao: "ESTOMAQUICOS/ANTI-FISETICOS" },
      { codigo: 45, descricao: "OUTROS LAXANTES E ASSOCIACÖES" },
      { codigo: 46, descricao: "PRO-CINETICOS" },
      { codigo: 47, descricao: "ANTIPARASITARIO" },
      { codigo: 48, descricao: "FARMACOS ANTI-SECRETORES" },
    ],
    9: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 47, descricao: "ANTIASMATICOS" },
      { codigo: 48, descricao: "ANTITUSSIGENOS" },
      { codigo: 49, descricao: "DESCONGESTIONANTES NASAIS" },
      { codigo: 50, descricao: "FARM. P/ DISTURBIOS PULMONARES" },
      { codigo: 51, descricao: "EXPECTORANTES" },
    ],
    10: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 51, descricao: "ANTICOLINERGICOS" },
      { codigo: 51, descricao: "MUSCOLOTROPICOS" },
    ],
    11: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 53, descricao: "ESTIMULANTES UTERINOS" },
      { codigo: 54, descricao: "FARM. P/ DISTURBIO HORM. FEM." },
      { codigo: 55, descricao: "FARM. P/ DISTURBIO HORM. MASC." },
      { codigo: 56, descricao: "RELAX. UTERINO/INIB PROLACTINA." },
      { codigo: 57, descricao: "ADRENOCORTICOIDE" },
      { codigo: 58, descricao: "HORMONIOS TIREIOIDIANOS" },
      { codigo: 59, descricao: "HORMONIOS ANTIDIURETICOS" },
    ],
    12: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 57, descricao: "ANTI-HISTAMINICOSR" },
      { codigo: 58, descricao: "IMUNOESTIMULANTES" },
      { codigo: 59, descricao: "IMUNOGLOBULINAS" },
      { codigo: 60, descricao: "IMUNOSSUPRESSORES" },
      { codigo: 61, descricao: "VACINAS" },
    ],
    13: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 62, descricao: "SUBSTANCIAS HORMONAIS" },
    ],
    14: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 63, descricao: "AGUA, GLICOSE E SAIS MINERAIS" },
      { codigo: 64, descricao: "ANTIDIABETICOS" },
      { codigo: 65, descricao: "ANTILIPEMICOS" },
      { codigo: 66, descricao: "DIETAS ENTERAIS" },
      { codigo: 67, descricao: "DIETAS PARENTERAIS" },
      { codigo: 68, descricao: "DIURETICOS" },
      { codigo: 69, descricao: "FARM. AFETAM A CALCIFICACAO" },
      { codigo: 70, descricao: "FARM. P/ HIPERTIREOIDISMO" },
      { codigo: 71, descricao: "FARM. P/ HIPOTIREOIDISMO" },
      { codigo: 72, descricao: "HIPERGLICEMIANTE/ANABOLIZANTE" },
      { codigo: 73, descricao: "HORM.ANTIDIURETICOS E ANALOGOS" },
      { codigo: 74, descricao: "MINERALOCORTICOIDES" },
      { codigo: 75, descricao: "REHIDRATACAO ORAL" },
      { codigo: 76, descricao: "RESINAS PERMUTADORAS DE IONS" },
      { codigo: 77, descricao: "SOLUCOES PARA DIALISE" },
      { codigo: 78, descricao: "VITAMINAS" },
      { codigo: 79, descricao: "HEPATOPROTETOR" },
    ],
    15: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 79, descricao: "MIORRELAXANTES CENTRAIS" },
      { codigo: 80, descricao: "MIORRELAXANTES PERIFERICOS" },
    ],
    16: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 81, descricao: "ANTIGLAUCOMATOSOS" },
      { codigo: 82, descricao: "ANTIINFECCIOSOS" },
      { codigo: 83, descricao: "ANTIINFLAMATORIOS" },
      { codigo: 84, descricao: "CORANTE/SOL.IRRIGACAO/LUBRIF." },
      { codigo: 85, descricao: "GLICOCORTICOIDES" },
      { codigo: 86, descricao: "MIDRIATICOS E CICLOPLEGICOS" },
      { codigo: 87, descricao: "MIOTICOS" },
      { codigo: 88, descricao: "VISCOELASTICOS" },
    ],
    17: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 89, descricao: "ANTIINFECCIOSOS" },
      { codigo: 90, descricao: "CERUMENOLITICO E EMOL. CERUMEN" },
    ],
    18: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 91, descricao: "ANTICOAGULANTES/HEMOSTATICOS" },
      { codigo: 92, descricao: "ANTIINFECCIOSOS TOPICO" },
      { codigo: 93, descricao: "ANTIINFLAMATORIOS" },
      { codigo: 94, descricao: "ANTI-SEPTICOS" },
      { codigo: 95, descricao: "ANTIULCEROSOS DERMICOS" },
      { codigo: 96, descricao: "EMOLIENTES/CONDUTORES" },
      { codigo: 97, descricao: "GLICOCORTICOIDES" },
      { codigo: 98, descricao: "MUCOPOLISSACARIDASES" },
      { codigo: 99, descricao: "QUERATOLITICO/QUERATOPLASTICO" },
      { codigo: 100, descricao: "ANTIFUNGICO TOPICO" },
    ],
    19: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 100, descricao: "ANTIANEMICOS ANTIMICROCITICOS" },
      { codigo: 101, descricao: "ANTIANEMICOS RENAIS" },
      { codigo: 102, descricao: "ANTICOAGULANTES" },
      { codigo: 103, descricao: "ANTIFIBRINOLITICOS" },
      { codigo: 104, descricao: "ANTINEUTROPENICOS" },
      { codigo: 105, descricao: "ANTITROMBOTICOS" },
      { codigo: 106, descricao: "COAGULANTES DIVERSOS" },
      { codigo: 107, descricao: "FIBRINOLITICOS" },
      { codigo: 108, descricao: "FOLATOS" },
      { codigo: 109, descricao: "HEMOSTIPTICOS" },
      { codigo: 110, descricao: "SANGUE E FRACOES DO SANGUE" },
      { codigo: 111, descricao: "SUBSTITUTOS DO SANGUE" },
      { codigo: 112, descricao: "FARMACOS ANTIANEMICOS" },
    ],
    20: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 112, descricao: "ANALGESICOS ANTIENXAQUECA" },
      { codigo: 113, descricao: "ANALGESICOS-ANTIPIRETICOS" },
      { codigo: 114, descricao: "ANTIPARKINSONIANOS" },
      { codigo: 115, descricao: "ANTIVERTIGINOSOS" },
      { codigo: 116, descricao: "ANTIDEPRESSIVO TRICICLICO" },
    ],
    21: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 116, descricao: "ANEST. LOCAL DER. DE AMIDAS" },
      { codigo: 117, descricao: "ANEST. LOCAL DER. DE ESTERES" },
    ],
    22: [
      { codigo: 1, descricao: "IMUNOPROTETORES VACINAS E SORO" },
      { codigo: 2, descricao: "IMUNOSSUPRESSOR" },
    ],
    23: [
      { codigo: 1, descricao: "ANTI-HISTAMINICO" },
      { codigo: 2, descricao: "GLICOCORTICOIDE" },
    ],
    24: [{ codigo: 1, descricao: "ANTISSEPTICOS" }],
    25: [{ codigo: 1, descricao: "AGENTES DE DIAGNOSTICOS" }],
    26: [{ codigo: 1, descricao: "POMADA CICATRIZANTE" }],
    27: [{ codigo: 1, descricao: "LAXANTES OSMOTICOS" }],
    28: [{ codigo: 1, descricao: "SOL PARENTERAIS ELETROL E DILUENTES" }],
    29: [{ codigo: 1, descricao: "DIURETICOS" }],
    30: [{ codigo: 1, descricao: "MEDICAMENTOS OFTALMICOS" }],
    31: [
      { codigo: 1, descricao: "ANALGESICO OPIOIDE" },
      { codigo: 2, descricao: "ANALGESICO / ANTIPIRETICO E ANTITERMICO" },
      { codigo: 3, descricao: "ANALGESICOS OPIOIDES / HIPOANALGESICOS" },
      { codigo: 4, descricao: "ANESTESICOS GERAIS" },
      { codigo: 5, descricao: "ANESTESICOS LOCAIS" },
      { codigo: 6, descricao: "ANTICOLINERGICOS E ANTIESPASMODICOS" },
      { codigo: 7, descricao: "OUTROS ANALGESICOS" },
    ],
    32: [
      { codigo: 1, descricao: "AMINOGLICOSIDEOS" },
      { codigo: 2, descricao: "ANTIBIOTICOS/ANTIFUNGICOS/ANTI-INFLAMATORIO" },
      { codigo: 3, descricao: "ANTIFUNGICOS" },
      { codigo: 4, descricao: "ANTIINFECCIOSO" },
      { codigo: 5, descricao: "ANTI-INFLAMATORIO ESTEROIDAL" },
      { codigo: 6, descricao: "ANTIPARASITARIO" },
      { codigo: 7, descricao: "ANTIPROTOZOARIOS" },
      { codigo: 8, descricao: "BETA LACTAMICOS" },
      { codigo: 9, descricao: "CEFALOSPORINAS" },
      { codigo: 10, descricao: "FLUOROQUINOLONAS" },
      { codigo: 11, descricao: "LINCOSAMIDAS" },
      { codigo: 12, descricao: "OTOLOGICOS" },
      { codigo: 13, descricao: "PENICILINAS" },
      { codigo: 14, descricao: "SULFANOMIDAS" },
      { codigo: 15, descricao: "TETRACICLINAS" },
      { codigo: 16, descricao: "MACROLIDEOS" },
    ],
    33: [
      { codigo: 1, descricao: "ANTIEPILETICOS/CONVULSOES EPILEPSIA" },
      { codigo: 2, descricao: "SEDATIVOS/ANSIOLITICOS/HIPNOTICOS" },
      { codigo: 3, descricao: "SEDATIVOS/ANSIOLITICOS/HIPNOTICOS" },
      { codigo: 4, descricao: "ANTIPSICOTICOS/PSICOSES DEMENCIA" },
    ],
    34: [{ codigo: 1, descricao: "SUPLEMENTO DE VITAMINAS E MINERAIS" }],
    35: [
      { codigo: 1, descricao: "SUPLEMENTO DE VITAMINAS E MINERAIS" },
      { codigo: 2, descricao: "PREBIOTICOS E PROBIOTICOS" },
    ],
    36: [{ codigo: 1, descricao: "OSTEOARTRITE" }],
  },
  2: {
    0: [{ codigo: 0, descricao: "A CLASSIFICAR ESPÉCIE 2" }],
    1: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "AGULHAS" },
      { codigo: 2, descricao: "BISTURIS" },
      { codigo: 3, descricao: "CATETERES" },
      { codigo: 4, descricao: "EQUIPOS/INJETOR" },
      { codigo: 5, descricao: "LAMINAS/LANCETAS" },
      { codigo: 6, descricao: "SCALPS" },
      { codigo: 7, descricao: "SERINGAS" },
      { codigo: 8, descricao: "CANULAS" },
      { codigo: 9, descricao: "DRENOS" },
      { codigo: 10, descricao: "SONDAS" },
      { codigo: 11, descricao: "FRASCOS" },
      {
        codigo: 12,
        descricao:
          "ADESIVOS/CURATIVOS/HEMOSTATICOS/ESPARADRAPOS/SELOS/TAMPAO/FRALDAS/ABSORVENTES",
      },
      { codigo: 13, descricao: "LATEX" },
      { codigo: 14, descricao: "BARACAS" },
      { codigo: 15, descricao: "BOLSAS" },
      { codigo: 16, descricao: "COLETORES" },
      { codigo: 17, descricao: "ATADURAS/FAIXAS/MALHAS" },
      { codigo: 18, descricao: "EPI (PROTETORES)" },
      { codigo: 19, descricao: "COMPRESSAS" },
      { codigo: 20, descricao: "PRESERVATIVOS" },
      { codigo: 21, descricao: "EXTENSORES/PERFUSORES" },
      {
        codigo: 22,
        descricao: "GERAMICIDAS/DETERGENTES/CICATRIZANTES/ALCOOL/OLEO",
      },
      { codigo: 23, descricao: "TEXTIL" },
      { codigo: 24, descricao: "TALAS" },
      { codigo: 25, descricao: "TIRAS/FITAS" },
      { codigo: 26, descricao: "ELETRODOS" },
      { codigo: 27, descricao: "CAPA/CAMISA/SACO" },
      { codigo: 28, descricao: "FIOS" },
      { codigo: 29, descricao: "TORNEIRAS/CONECTORES" },
      { codigo: 30, descricao: "ESCOVAS/ESPONJAS" },
      { codigo: 31, descricao: "ESPACADOR" },
      { codigo: 32, descricao: "IRRIGADOR/ASPIRADOR" },
      { codigo: 33, descricao: "PINCAS" },
      { codigo: 34, descricao: "TUBOS" },
      { codigo: 35, descricao: "RESERVATORIOS" },
      { codigo: 36, descricao: "PROTETORES" },
      { codigo: 37, descricao: "DISPOSITIVOS" },
      { codigo: 38, descricao: "PULSEIRAS" },
      { codigo: 39, descricao: "APARELHO DE TRICOTOMIA" },
      { codigo: 40, descricao: "KITS CIRURGICOS/ CONJUNTOS" },
      { codigo: 42, descricao: "TELAS" },
      { codigo: 43, descricao: "GRAMPEADOR CIRURGICO" },
      { codigo: 44, descricao: "INSTRUMENTAL" },
    ],
    2: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "PAPEIS PARA EXAMES" },
      { codigo: 6, descricao: "DESCONTAMINANTES 2" },
      { codigo: 7, descricao: "REAGENTE QUIMICOS" },
      { codigo: 8, descricao: "INSUMOS" },
      { codigo: 9, descricao: "EMBALAGENS" },
      { codigo: 10, descricao: "COLETORES" },
      { codigo: 12, descricao: "INDICADORES" },
      { codigo: 13, descricao: "ACESSORIOS" },
      { codigo: 14, descricao: "BOLSAS" },
    ],
    3: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "PAPEIS PARA EXAMES" },
      { codigo: 2, descricao: "FILMES RADIOLOGICOS" },
      { codigo: 3, descricao: "REVELADORES" },
      { codigo: 4, descricao: "FIXADORES" },
      { codigo: 5, descricao: "CONTRASTES" },
      { codigo: 6, descricao: "DESCONTAMINANTES" },
      { codigo: 7, descricao: "REAGENTE QUIMICOS" },
      { codigo: 8, descricao: "INSUMOS" },
      { codigo: 9, descricao: "EMBALAGENS" },
      { codigo: 10, descricao: "COLETORES" },
      { codigo: 11, descricao: "MONITORIZACAO" },
      { codigo: 12, descricao: "INDICADORES" },
      { codigo: 13, descricao: "ACESSORIOS" },
    ],
    4: [
      { codigo: 1, descricao: "COLAS" },
      { codigo: 2, descricao: "FITAS" },
      { codigo: 3, descricao: "CURATIVOS" },
    ],
    5: [
      { codigo: 1, descricao: "CANULAS" },
      { codigo: 2, descricao: "COLETOR" },
      { codigo: 3, descricao: "SONDA" },
      { codigo: 4, descricao: "TUBOS" },
      { codigo: 5, descricao: "DRENOS" },
    ],
    6: [
      { codigo: 1, descricao: "AVENTAL" },
      { codigo: 2, descricao: "DESCARTAVEIS" },
      { codigo: 3, descricao: "TOUCA" },
    ],
    7: [
      { codigo: 1, descricao: "AGULHAS" },
      { codigo: 2, descricao: "BISTURIS" },
      { codigo: 3, descricao: "CATETERES" },
      { codigo: 4, descricao: "COLETOR" },
      { codigo: 5, descricao: "CONECTORES" },
      { codigo: 6, descricao: "EQUIPOS" },
      { codigo: 7, descricao: "EXTENSORES" },
      { codigo: 8, descricao: "SCALP" },
      { codigo: 9, descricao: "SERINGAS" },
      { codigo: 10, descricao: "TORNEIRINHAS" },
    ],
    8: [{ codigo: 1, descricao: "LUVAS" }],
    9: [{ codigo: 1, descricao: "ODONTOLOGICOS" }],
    11: [
      { codigo: 1, descricao: "GERMICIDAS" },
      { codigo: 2, descricao: "INSUMOS" },
    ],
    12: [
      { codigo: 1, descricao: "CIRURGICA GERAL" },
      { codigo: 2, descricao: "ORTOPEDICA" },
      { codigo: 3, descricao: "CIRURGIA CARDIACA" },
    ],
    13: [
      { codigo: 1, descricao: "ATADURAS" },
      { codigo: 2, descricao: "CADARCO" },
      { codigo: 3, descricao: "COMPRESSAS" },
      { codigo: 4, descricao: "MALHA" },
      { codigo: 4, descricao: "MASCARAS" },
    ],
    14: [
      { codigo: 1, descricao: "COLETA" },
      { codigo: 2, descricao: "DESCARTAVEIS" },
      { codigo: 4, descricao: "DIAGNOSTICOS E MONITORIZACAO" },
      { codigo: 5, descricao: "EPIS" },
      { codigo: 6, descricao: "GEL" },
      { codigo: 7, descricao: "INDICADORES" },
      { codigo: 8, descricao: "LUVAS LATEX" },
      { codigo: 9, descricao: "PUNCH" },
      { codigo: 10, descricao: "TALAS" },
      { codigo: 11, descricao: "USO PESSOAL" },
      { codigo: 12, descricao: "LUVAS SEM LATEX" },
      { codigo: 13, descricao: "SUPORTES" },
      { codigo: 14, descricao: "INSUMOS" },
    ],
  },
  3: {
    0: [{ codigo: 0, descricao: "A CLASSIFICAR" }],
    1: [
      { codigo: 0, descricao: "A CLASSIFICAR - NÃO UTILIZAR" },
      { codigo: 1, descricao: "INSTALAÇÕES" },
      { codigo: 2, descricao: "MOVEIS E UTENSILIOS" },
      { codigo: 3, descricao: "MATERIAIS DE INFORMATICA" },
      { codigo: 4, descricao: "CAIXAS CIRURGICAS" },
      { codigo: 5, descricao: "MAQUINAS E EQUIPAMENTOS" },
      { codigo: 6, descricao: "EQUIPAMENTOS HOSPITALARES - ATIVO " },
      { codigo: 7, descricao: "MATERIAIS PARA MANUTENÇÃO" },
      { codigo: 8, descricao: "CONSTRUÇÃO/REFORMA IMOVEL DE TERCEIRO" },
    ],
    2: [
      { codigo: 1, descricao: "MATERIAIS DE MANUTENÇÃO" },
      { codigo: 2, descricao: "MATERIAIS DE ESCRITORIO" },
      { codigo: 3, descricao: "EQUIPAMENTOS HOSPITALARES - CONSUMO " },
      { codigo: 4, descricao: "EQUIPAMENTOS PARA MANUTENÇÃO - CONSUMO " },
      { codigo: 5, descricao: "INFORMATICA CONSUMO " },
      { codigo: 6, descricao: "MOVEIS E UTENSILIOS " },
    ],
  },
  4: {
    0: [{ codigo: 1, descricao: "A CLASSIFICAR" }],
    1: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "GASES MEDICINAIS" },
      { codigo: 2, descricao: "GASES INDUSTRIAIS" },
    ],
  },
  5: {
    1: [{ codigo: 0, descricao: "MATERIAL DE COPA E COZINHA" }],
  },
  6: {
    1: [
      { codigo: 1, descricao: "LEITES ESPECIAIS" },
      { codigo: 2, descricao: "ALIMENTO COADJUVANTE CONVALESCENÇA" },
      { codigo: 3, descricao: "ITENS MAQUINA CAFE" },
      { codigo: 4, descricao: "ALIMENTO" },
    ],
  },
  7: {
    0: [{ codigo: 0, descricao: "A CLASSIFICAR" }],
    1: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "ORTOPEDIA" },
      { codigo: 2, descricao: "CIRURGIA GERAL" },
      { codigo: 3, descricao: "CARDIOVASCULAR" },
      { codigo: 4, descricao: "NEUROCIRURGIA" },
      { codigo: 5, descricao: "OFTALMOLOGIA" },
      { codigo: 6, descricao: "UROLOGIA" },
      { codigo: 7, descricao: "OTORRINOLARINGOLOGIA" },
      { codigo: 8, descricao: "CIRURGIA PLASTICA" },
      { codigo: 9, descricao: "FERRAMENTAS/ACESSORIOS/INSTRUMENTOS" },
      { codigo: 10, descricao: "ORTODONTIA/ODONTOLOGIA" },
      { codigo: 11, descricao: "MEDICAMENTOS" },
    ],
    2: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "ORTOPEDICA" },
      { codigo: 2, descricao: "OFTALMICA" },
      { codigo: 3, descricao: "ODONTOLOGICA" },
    ],
  },
  8: {
    1: [{ codigo: 0, descricao: "MATERIAL DE MANUTENCAO" }],
  },
  9: {
    1: [{ codigo: 0, descricao: "MATERIAL DE SEGURANCA" }],
  },
  10: {
    0: [{ codigo: 0, descricao: "A CLASSIFICAR" }],
    2: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 2, descricao: "CAIXA" },
    ],
  },
  11: {
    1: [{ codigo: 0, descricao: "COMBUSTIVEIS E LUBRIFICANTES" }],
  },
  12: {
    1: [{ codigo: 0, descricao: "COMBUSTIVEIS E LUBRIFICANTES" }],
  },
  13: {
    1: [{ codigo: 0, descricao: "MATERIAL DE ROUPARIA" }],
  },
  14: {
    1: [
      { codigo: 0, descricao: "MATERIAL DE LABORATORIO" },
      { codigo: 1, descricao: "COLETA DE SANGUE " },
      { codigo: 2, descricao: "AMOSTRA BIOLÓGICA" },
      { codigo: 3, descricao: "REAGENTE" },
    ],
  },
  15: {
    0: [{ codigo: 0, descricao: "A CLASSIFICAR" }],
    1: [
      { codigo: 0, descricao: "A CLASSIFICAR" },
      { codigo: 1, descricao: "NUTRIENTES ENTERAIS" },
      { codigo: 2, descricao: "NUTRIENTES PARENTERAIS" },
    ],
  },
  16: {
    1: [{ codigo: 1, descricao: "AREIA" }],
    2: [
      { codigo: 1, descricao: "COLAR" },
      { codigo: 2, descricao: "EMBALAGEM" },
      { codigo: 3, descricao: "FOCINHEIRAS" },
      { codigo: 4, descricao: "SACOS" },
      { codigo: 5, descricao: "INSUMOS" },
    ],
  },
  17: {
    1: [{ codigo: 1, descricao: "HIGIENE" }],
  },
  18: {
    1: [{ codigo: 1, descricao: "MATERIAL CONSUMO" }],
  },
  19: {
    1: [{ codigo: 1, descricao: "SACOS" }],
  },
  20: {
    1: [{ codigo: 1, descricao: "MATERIAL ESCRITORIO" }],
  },
  21: {
    1: [
      { codigo: 1, descricao: "SECA" },
      { codigo: 2, descricao: "UMIDA" },
      { codigo: 3, descricao: "MEDICAMENTOSA" },
    ],
    2: [{ codigo: 1, descricao: "RAÇÃO" }],
    3: [{ codigo: 1, descricao: "RAÇÃO" }],
  },
  22: {
    1: [
      { codigo: 1, descricao: "BRINDES CORPORATIVOS" },
      { codigo: 2, descricao: "PROGRAMA DE FIDELIDADE MÉDICO" },
      { codigo: 3, descricao: "PROGRAMA DE FIDELIDADE TUTOR" },
    ],
  },
};

const especieMapping = {
  1: "DROGAS E MEDICAMENTOS",
  2: "MATERIAL MEDICO HOSPITALAR",
  3: "PATRIMONIO",
  4: "GASES HOSPITALARES",
  5: "MATERIAL DE COPA E COZINHA",
  6: "GENEROS ALIMENTICIOS",
  7: "ORTESE, PROTESE E MAT. ESPECIAL",
  8: "MATERIAL DE MANUTENCAO",
  9: "MATERIAL DE SEGURANCA",
  10: "MATERIAL DE HIGIENIZACAO",
  11: "COMBUSTIVEIS E LUBRIFICANTES",
  12: "MATERIAIS DE EXPEDIENTE",
  13: "MATERIAL DE ROUPARIA",
  14: "MATERIAL DE LABORATORIO",
  15: "NUTRIENTES ENTERAIS/PARENTERAIS",
  16: "INSUMOS",
  17: "HIGIENE",
  18: "MATERIAL CONSUMO",
  19: "MATERIAL DE EMBALAGEM",
  20: "MATERIAL DE ESCRITORIO",
  21: "RAÇÃO",
  22: "BRINDES",
};

function convertToUpperCase(obj) {
  const newObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = Array.isArray(obj[key])
        ? obj[key].map((item) =>
            typeof item === "string" ? item.toUpperCase() : item
          )
        : typeof obj[key] === "string"
        ? obj[key].toUpperCase()
        : obj[key];
    }
  }
  return newObj;
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "menu.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint para obter os dados de espécie, classe e subclasse
app.get("/dados", (req, res) => {
  res.json({
    especieClasseMapping,
    classeSubclasseMapping,
    especieMapping,
  });
});

app.post("/salvar_produto", (req, res) => {
  const formData = convertToUpperCase(req.body);
  const {
    cadastro_urgente,
    codigo,
    kit,
    consignado,
    opme,
    descricao_especie,
    descricao_classe,
    descricao_subclasse,
    atividade,
    unidade,
    curva_abc,
    serie,
    registro_anvisa,
    etiqueta,
    med_controla,
    validade,
    armazenamento_ar_cond,
    armazenamento_geladeira,
    padronizado,
    sn_movimentacao,
    sn_bloqueio_de_compras,
    aplicacao,
    auto_custo,
    valor,
    repasse,
    procedimento_faturamento,
    tipo_atendimento_ps,
    tipo_atendimento_ambulatorial,
    tipo_atendimento_internacao,
    tipo_atendimento_externo,
    tipo_atendimento_todos,
    observacao,
    precificar,
    setor_solicitante,
    usuario,
    email,
    email_cc,
  } = formData;

  const descricoes = formData.descricao || [];
  const desc_resumidas = formData.desc_resumida || [];
  const valores_unitarios = formData.valor_unitario || [];
  const marcas1 = formData.LAB_PRO_1 || [];
  const marcas2 = formData.LAB_PRO_2 || [];
  const marcas3 = formData.LAB_PRO_3 || [];

  let descricoesHtml = "";
  for (let i = 0; i < descricoes.length; i++) {
    descricoesHtml += `
            <p><strong>Descrição ${i + 1}:</strong> ${descricoes[i]}</p>
            <p><strong>Descrição Resumida ${i + 1}:</strong> ${
      desc_resumidas[i]
    }</p>
            <p><strong>Valor Unitário ${i + 1}:</strong> ${
      valores_unitarios[i]
    }</p>
            <p><strong>Marcas 1 - ${i + 1}:</strong> ${marcas1[i]}</p>
            <p><strong>Marcas 2 - ${i + 1}:</strong> ${marcas2[i]}</p>
            <p><strong>Marcas 3 - ${i + 1}:</strong> ${marcas3[i]}</p>
        `;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: "cadastro_pet@outlook.com",
      pass: "Gic@29098",
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false, // Permite conexões a servidores com certificados autoassinados
    },
  });

  const mailOptions = {
    from: "cadastro_pet@outlook.com",
    to: "cadastro_pet@outlook.com",
    subject: "Solicitação de Cadastro",
    html: `
            <h1>Solicitação de Cadastro:</h1>
            <p><strong>Cadastro de Urgência:</strong> ${cadastro_urgente}</p>
            ${codigo ? `<p><strong>Código:</strong> ${codigo}</p>` : ""}
            ${descricoesHtml}
            <p><strong>Unidade:</strong> ${unidade}</p>
            <p><strong>Kit:</strong> ${kit}</p>
            <p><strong>Consignado:</strong> ${consignado}</p>
            <p><strong>OPME:</strong> ${opme}</p>
            <p><strong>Espécie:</strong> ${descricao_especie}</p>
            <p><strong>Classe:</strong> ${descricao_classe}</p>
            <p><strong>Sub-Classe:</strong> ${descricao_subclasse}</p>
            <p><strong>Atividade:</strong> ${atividade}</p>
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
            <p><strong>Precificar:</strong> ${precificar}</p>
            <p><strong>Setor se solicitação da compra:</strong> ${setor_solicitante}</p>
            <p><strong>Usuário:</strong> ${usuario}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Com cópia:</strong> ${email_cc}</p>
        `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send("Erro ao enviar e-mail");
    } else {
      console.log("E-mail enviado: " + info.response);
      res.send("Produto cadastrado com sucesso!");
    }
  });
});

app.post("/responder_email", (req, res) => {
  const { from, to, cc, subject, message } = convertToUpperCase(req.body);

  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: "cadastro_pet@outlook.com",
      pass: "Gic@29098",
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false, // Permite conexões a servidores com certificados autoassinados
    },
  });

  const mailOptions = {
    from: from || "cadastro_pet@outlook.com",
    to: to,
    cc: cc,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send("Erro ao enviar e-mail de resposta");
    } else {
      console.log("E-mail de resposta enviado: " + info.response);
      res.send("E-mail de resposta enviado com sucesso!");
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
