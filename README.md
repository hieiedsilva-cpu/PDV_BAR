# Bar do Wood - Sistema PDV

## Configuração para Deploy na Vercel

Este projeto foi configurado para ser facilmente implantado na Vercel. Siga as instruções abaixo para realizar o deploy completo.

### Estrutura do Projeto

- **Frontend**: Aplicação React com Vite
- **Backend**: API Express em Node.js
- **API**: Configuração serverless para a Vercel

### Passos para Deploy

1. **Acesse o Dashboard da Vercel**
   - Vá para [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub

2. **Importe o Projeto**
   - Clique em "Add New" > "Project"
   - Selecione o repositório GitHub do projeto
   - A Vercel detectará automaticamente as configurações do projeto

3. **Configure as Variáveis de Ambiente**
   Na interface da Vercel, adicione as variáveis de ambiente necessárias:
   - `NODE_ENV`: production
   - `GEMINI_API_KEY`: (se estiver utilizando a API do Gemini)

4. **Inicie o Deploy**
   - Clique em "Deploy"
   - Aguarde a conclusão do processo
   - A Vercel fornecerá um URL para acessar sua aplicação

5. **Solução de Problemas**
   Se encontrar o erro 404 após o deploy:
   - Verifique os logs de build na Vercel
   - Confirme que o arquivo vercel.json está configurado corretamente
   - Verifique se as variáveis de ambiente estão configuradas

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