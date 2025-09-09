# Bar do Wood - Sistema PDV

## Configuração para Deploy na Vercel

Este projeto foi configurado para ser facilmente implantado na Vercel. Siga as instruções abaixo para realizar o deploy completo.

### Estrutura do Projeto

- **Frontend**: Aplicação React com Vite
- **Backend**: API Express em Node.js
- **API**: Configuração serverless para a Vercel

### Passos para Deploy

1. **Crie uma conta na Vercel** (se ainda não tiver)

2. **Instale a CLI da Vercel**
   ```
   npm install -g vercel
   ```

3. **Faça login na Vercel**
   ```
   vercel login
   ```

4. **Deploy do projeto**
   ```
   vercel
   ```

5. **Configuração de Variáveis de Ambiente**
   - No dashboard da Vercel, vá para o seu projeto
   - Acesse a aba "Settings" > "Environment Variables"
   - Adicione a variável `VITE_API_URL` com o valor da URL da sua API (ex: https://seu-projeto.vercel.app/api)

### Desenvolvimento Local

1. **Backend**
   ```
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend**
   ```
   cd frontend
   npm install
   npm start
   ```

### Estrutura de Arquivos Importantes

- `vercel.json`: Configuração do deploy na Vercel
- `api/server.js`: Ponto de entrada para as funções serverless
- `frontend/.env`: Configuração de variáveis de ambiente para produção
- `frontend/.env.development`: Configuração de variáveis de ambiente para desenvolvimento