# ✦ Aura Creator - Studio Criativo com IA

> **Sua central de inteligência artificial para criação de conteúdo em redes sociais.**
> *Analisa imagens, gera estratégias e simula o resultado final em tempo real.*

---

## 🎯 Sobre o Projeto

O **Aura Creator** é uma aplicação Full-Stack desenvolvida para resolver o bloqueio criativo de Social Media Managers e Influenciadores. Diferente de chats de IA comuns, o AuraOS é **Multimodal** (enxerga imagens) e **Contextual** (sabe como cada rede social funciona).

O sistema permite que o usuário faça upload de uma imagem e receba legendas, hashtags, roteiros e títulos otimizados, visualizando imediatamente como o post ficará no Instagram, YouTube, LinkedIn ou Twitter através de **Mockups Fiéis**.

---

## 🛠️ Tech Stack (O que foi usado e Por Quê?)

Este projeto foi construído com uma arquitetura moderna, focada em performance e experiência do usuário (UX).

| Tecnologia | Função no Projeto | Por que escolhemos? |
| :--- | :--- | :--- |
| **Python 3.10+** | Linguagem Base | Linguagem nativa da IA e Data Science. Robusta e com excelente suporte a bibliotecas. |
| **FastAPI** | Backend / API | Framework moderno e assíncrono. Muito mais rápido que Flask/Django e perfeito para lidar com chamadas de IA que levam tempo (não trava o servidor). |
| **Google Gemini 1.5** | Cérebro (IA) | Modelo Multimodal (Vê texto e imagem). Escolhido pela alta velocidade ("Flash"), janela de contexto grande e custo-benefício (Free Tier). |
| **SQLite + SQLAlchemy** | Banco de Dados | **SQLite:** Banco leve que funciona em um arquivo local (sem instalação complexa). **SQLAlchemy:** O melhor ORM do Python para gerenciar dados com segurança. |
| **HTML5 + CSS3** | Frontend | Usamos **CSS Puro** com variáveis para criar o estilo *Glassmorphism* (Vidro/Neon). Frameworks pesados (React) foram evitados para manter o projeto leve e performático. |
| **Vanilla JavaScript** | Lógica do Cliente | Manipulação do DOM, chamadas de API (`fetch`) e renderização dos Mockups sem dependências externas pesadas. |
| **Marked.js** | Utilitário | Biblioteca ultra-leve para converter o texto da IA (Markdown) em HTML formatado (negrito, listas). |

---

## ✨ Funcionalidades Principais

1.  **👁️ Visão Computacional:** A IA analisa a foto enviada (cores, sentimentos, objetos) para criar conteúdo contextual.
2.  **📱 Mockups em Tempo Real:**
    * **Instagram:** Simula o feed escuro com a legenda formatada.
    * **YouTube:** Gera um card estilo "Home do YouTube" com a thumbnail e título inserido.
    * **LinkedIn/Twitter:** Simula os layouts específicos dessas redes.
3.  **📂 Histórico Automático:** Tudo o que é gerado é salvo automaticamente em um banco de dados local (`aura_history.db`) e pode ser consultado na aba lateral.
4.  **⚡ Geração Assíncrona:** O uso de `async/await` no Python garante que o site não trave enquanto a IA "pensa".
5.  **💎 UX Premium:** Interface com animações fluidas, efeitos de vidro (blur), transições suaves e tratamento de erros amigável (telas de loading, avisos de premium).

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para ter o projeto rodando na sua máquina.

### 1. Pré-requisitos
* Python instalado.
* Uma chave de API do Google AI Studio.

### 2. Instalação

Clone o repositório ou baixe os arquivos, depois abra o terminal na pasta do projeto:

```bash
# 1. Crie um ambiente virtual
python -m venv venv

# 2. Ative o ambiente
# No Windows:
.\venv\Scripts\activate
# No Linux/Mac:
source venv/bin/activate

# 3. Instale as dependências
pip install requirements.txt