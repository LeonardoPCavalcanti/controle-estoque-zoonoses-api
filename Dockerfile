# Imagem base
FROM node:18

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Expõe a porta do backend
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
