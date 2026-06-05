# Sistema de A/B Testing

Este projeto foi construído para simular um teste A/B em um aplicativo mobile, enviando métricas para um backend e visualizando tudo através de um Dashboard de alta qualidade.

## Estrutura

- `/backend`: API construída com Node.js e Express. Recebe os eventos, guarda num `data.json` local e retorna métricas prontas para gráficos.
- `/web`: Dashboard em Vite + ReactJS + Tailwind. Mostra resultados de visualizações, tempo de renderização e análise de cliques nas Versões A/B.
- `/mobile`: App React Native utilizando o Expo para simular dois fluxos aos usuários.

---

## 🚀 Como Rodar o Projeto

Siga as instruções abaixo, recomendável rodar cada sistema em um terminal diferente (ou abas separadas).

### 1. Rodar o Backend
Abra o terminal, navegue até a pasta `backend` e inicie o servidor:
```bash
cd backend
npm install
npm start
```
*A API ficará disponível em `http://localhost:3000`*.
*(Opcional: Seed de dados)*: Se quiser dados falsos para testar o painel, faça uma chamada POST para `http://localhost:3000/seed`.

### 2. Rodar o Dashboard Web
Abra outro terminal, navegue até a pasta `web` e inicie o Vite:
```bash
cd web
npm install
npm run dev
```
*O Dashboard ficará disponível no link do terminal (geralmente `http://localhost:5173`)*.

### 3. Rodar o Aplicativo Mobile
Abra outro terminal, navegue até a pasta `mobile` e inicie o Expo:
```bash
cd mobile
npm install
npx expo start
```
Use o aplicativo *Expo Go* no iOS ou Android para ler o QR Code ou aperte `a` no terminal para abrir num emulador Android rodando no seu PC.
*(No caso do emulador, a conexão para o backend será `http://10.0.2.2:3000`. Isso está configurado em `mobile/Tracker.js`)*.

---

## O que será monitorado?

O aplicativo mobile envia via API rastros de evento para:
- `page_view`: Qual página o usuário entrou (Home ou Details).
- `render_time`: Quantos milisegundos a UI demorou do momento da montagem ao descarregamento (Paint)
- `click`: Onde o usuário tocou (Qual botão e em qual versão do app).
