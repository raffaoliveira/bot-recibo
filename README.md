# 🤖 Bot de Recibos - Telegram

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Google Drive](https://img.shields.io/badge/Google%20Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=for-the-badge&logo=googlesheets&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)

</div>

## 📋 Sobre o Projeto

Bot automatizado para **controle financeiro pessoal** via Telegram que processa recibos enviados como fotos, extrai informações através de legendas estruturadas e organiza automaticamente os dados em planilhas Google Sheets, com backup das imagens no Google Drive.

### 🎯 Funcionalidades

- ✅ **Recepção de fotos** via Telegram com processamento inteligente
- ✅ **Upload automático** para Google Drive com links compartilháveis
- ✅ **Registro estruturado** em Google Sheets com formatação
- ✅ **Parsing de dados** com validação de entrada
- ✅ **Tratamento de erros** robusto e mensagens informativas
- ✅ **Autenticação OAuth2** com refresh token persistente

## 🛠️ Tecnologias Utilizadas

### Core

- **TypeScript** - Tipagem estática e desenvolvimento robusto
- **Node.js** - Runtime JavaScript para backend
- **Telegraf** - Framework moderno para bots do Telegram

### APIs & Integrações

- **Google Drive API** - Armazenamento e compartilhamento de arquivos
- **Google Sheets API** - Manipulação de planilhas com fórmulas
- **Google OAuth2** - Autenticação segura com refresh tokens

### Ferramentas de Desenvolvimento

- **Biome** - Linting e formatação de código
- **tsx** - Execução TypeScript sem build
- **dotenv** - Gerenciamento de variáveis de ambiente

## 🚀 Como Configurar

### 1. **Pré-requisitos**

- Node.js 18+ instalado
- Conta Google com acesso ao Drive e Sheets
- Bot do Telegram criado via @BotFather

### 2. **Configuração do Google Cloud**

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative as APIs necessárias:
   - Google Drive API
   - Google Sheets API
4. Vá em **Credenciais** → **Criar Credenciais** → **ID do cliente OAuth 2.0**
5. Configure o tipo de aplicativo como **Aplicativo para computador**
6. Adicione `http://localhost` como URI de redirecionamento autorizado

### 3. **Configuração do Bot Telegram**

1. Abra o Telegram e procure por @BotFather
2. Envie `/newbot` e siga as instruções
3. Copie o token fornecido

### 4. **Preparação do Ambiente**

```bash
# Clone o repositório
git clone

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

### 5. **Configuração do arquivo `.env`**

```env
# Bot do Telegram
BOT_TOKEN=seu_token_do_telegram

# Google Sheets e Drive
GOOGLE_SHEET_ID=id_da_sua_planilha
GOOGLE_DRIVE_FOLDER_ID=id_da_pasta_no_drive

# OAuth Google (obtidos no Google Cloud Console)
client_id=seu_client_id.apps.googleusercontent.com
client_secret=seu_client_secret
redirect_uris=http://localhost
```

### 6. **Geração do Token de Autenticação**

```bash
# Execute o script de autenticação
npm run auth

# Siga as instruções:
# 1. Abra a URL fornecida no navegador
# 2. Faça login com sua conta Google
# 3. Autorize o aplicativo
# 4. Copie o código da URL de redirecionamento
# 5. Cole o código no terminal
```

### 7. **Inicialização do Bot**

```bash
# Inicie o bot
npm start

# Para desenvolvimento com hot reload
npm run dev
```

## 📱 Como Usar

### Formato da Mensagem

Envie uma **foto** com legenda no formato:

```
Descrição - Tipo - Valor
```

### Exemplos

```
Almoço restaurante - Despesa - 45,50
Freelance desenvolvimento - Receita - 1200,00
Combustível posto - Despesa - 180,75
```

### Fluxo de Funcionamento

1. 📸 **Usuário envia foto** com legenda estruturada
2. 🔄 **Bot processa** e valida o formato
3. ☁️ **Upload para Google Drive** com link compartilhável
4. 📊 **Registro na planilha** com fórmula HYPERLINK
5. ✅ **Confirmação enviada** ao usuário

## 📁 Estrutura do Projeto

```
src/
├── bot.ts              # Bot principal do Telegram
├── google.ts           # Integrações Google (Drive + Sheets)
├── config/
│   └── env.ts         # Configuração de variáveis de ambiente
└── tools/
    └── capitalize.ts  # Utilitários de formatação
generateToken.ts        # Script de autenticação OAuth
```

## 🔧 Scripts Disponíveis

```bash
npm start          # Inicia o bot em produção
npm run dev        # Desenvolvimento com hot reload
npm run auth       # Gera token de autenticação
npm run lint       # Verifica qualidade do código
npm run format     # Formata código automaticamente
```

## 🛡️ Segurança

- ✅ **Tokens OAuth2** com refresh automático
- ✅ **Variáveis de ambiente** para credenciais
- ✅ **Validação de entrada** rigorosa
- ✅ **Tratamento de erros** abrangente
- ✅ **Logs estruturados** para debugging

## 📊 Recursos Técnicos Destacados

### Arquitetura Limpa

- Separação clara de responsabilidades
- Funções puras e reutilizáveis
- Tratamento centralizado de erros

### Integração Robusta

- Autenticação OAuth2 com refresh token
- Upload de arquivos com streams
- Manipulação avançada de planilhas

### Experiência do Usuário

- Feedback imediato sobre erros
- Formatação automática de dados
- Links clicáveis na planilha

## 🤝 Contribuição

Este projeto demonstra competências em:

- **Desenvolvimento Backend** com Node.js/TypeScript
- **Integração de APIs** Google e Telegram
- **Autenticação OAuth2** com refresh tokens
- **Processamento de arquivos** e streams
- **Validação de dados** e tratamento de erros
- **Clean Code** e boas práticas

---
