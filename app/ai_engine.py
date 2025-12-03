import os
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image
import pathlib
import asyncio

env_path = pathlib.Path('/home/work02/Documentos/Aline/AlineProjects/Aura_Creator/.env')
if not env_path.exists():
    env_path = pathlib.Path('.') / '.env'
load_dotenv(dotenv_path=env_path, override=True)

possible_names = ["GOOGLE_API_KEY", "GEMINI_API_KEY", "API_KEY", "KEY"]
api_key = None
for name in possible_names:
    val = os.getenv(name)
    if val:
        api_key = val
        break

if api_key:
    genai.configure(api_key=api_key)

def get_model():
    return genai.GenerativeModel('gemini-flash-latest')

PROMPTS = {
    # INSTAGRAM
    "instagram_legenda": """
        Atue como Social Media Expert para Instagram. Crie uma legenda altamente engajadora para esta imagem.
        Estrutura: Hook inicial forte, corpo curto e CTA (Call to Action). Use emojis relevantes.
    """,
    "instagram_hashtags": """
        Gere 30 hashtags estratégicas para esta imagem no Instagram, divididas em: 10 de Alto Volume, 10 de Nicho Específico e 10 Descritivas do que há na foto.
    """,
    
    # YOUTUBE
    "youtube_titulo": """
        Atue como um Especialista em SEO para YouTube. Analise a imagem (que seria a thumbnail) e gere 5 opções de Títulos Altamente clicáveis (Clickbait ético) e otimizados para SEO. Foco em CTR alto.
    """,
    "youtube_ideias": """
        Baseado nesta imagem, sugira 3 ideias completas de vídeo para o YouTube, incluindo: Título sugerido, Gancho inicial do roteiro e tipo de edição recomendada.
    """,

    "youtube_ideias": """
        Atue como um Estrategista de Conteúdo do YouTube. Analise a imagem enviada e, com base nela, sugira 3 ideias completas de vídeo.
        Para cada ideia, forneça:
        1. **Título Chamativo (Clickbait Ético)**
        2. **Gancho Inicial (Hook):** O que falar nos primeiros 5 segundos.
        3. **Estilo de Edição Sugerido:** (ex: Vlog, Tutorial, Cinematic, Cortes Rápidos).
        
        Formate a resposta usando Markdown com títulos e listas para facilitar a leitura.
    """,

    # TIKTOK
    "tiktok_roteiro": """
        Crie um roteiro viral para TikTok baseado nesta imagem/tema.
        Estrutura:
        - 0-3s: Gancho visual ou polêmico (texto na tela).
        - 3-15s: Desenvolvimento rápido (o que falar).
        - Final: CTA para seguir ou comentar.
        Sugira também uma música em alta.
    """,
    "tiktok_seo": """
        Gere uma descrição para o vídeo otimizada para SEO do TikTok (palavras-chave) e 5 hashtags virais do nicho.
    """,

    # LINKEDIN
    "linkedin_post": """
        Atue como um Top Voice do LinkedIn. Escreva um post profissional e inspirador baseado nesta imagem.
        Tom: Corporativo mas humanizado (Storytelling).
        Foque em lições de carreira, negócios ou superação. Use formatação de parágrafos curtos.
    """,
    "linkedin_artigo": """
        Sugira uma estrutura de Artigo (Pulse) baseada neste tema: Título chamativo, 3 tópicos principais para abordar e uma conclusão reflexiva.
    """,

    # FACEBOOK
    "facebook_post": """
        Crie um post para página de Facebook com alto potencial de compartilhamento.
        Foque em comunidade, nostalgia ou utilidade pública. O texto deve ser conversacional e amigável.
    """,
    "facebook_anuncio": """
        Crie 3 opções de "Copy" (texto de venda) para um anúncio de Facebook Ads usando esta imagem. Foco em conversão (AIDA: Atenção, Interesse, Desejo, Ação).
    """,

    # X / TWITTER
    "twitter_thread": """
        Transforme o conceito desta imagem em uma Thread (fio) do Twitter/X.
        Escreva o primeiro tweet (o gancho) e mais 3 tweets sequenciais desenvolvendo o assunto de forma direta e polêmica.
    """,
    "twitter_tweet": """
        Escreva 3 opções de tweets curtos e impactantes (máximo 280 caracteres) sobre esta imagem. Devem ser "citáveis" ou engraçados.
    """,

    # PINTEREST
    "pinterest_titulo": """
        Crie 3 títulos otimizados para SEO no Pinterest baseados nesta imagem. Devem ser curtos, diretos e inspiradores.
    """,
    "pinterest_descricao": """
        Escreva uma descrição rica em palavras-chave para um Pin do Pinterest usando esta imagem. Foque em inspirar o usuário a clicar e salvar.
    """,

    # TUMBLR
    "tumblr_post": """
        Crie um texto no estilo "aesthetic" e poético para o Tumblr baseado na vibe desta imagem. Seja profundo e curto.
    """,

    # GERAL 
    "analise_visual": """
        Faça uma auditoria técnica e estética desta imagem: Iluminação, Composição (Regra dos terços?), Paleta de Cores dominante e qual "vibe" ela transmite. Dê uma nota 0-10.
    """
}

async def process_image_mode(image_path, platform, task):
    if not api_key: return "Chave .env não encontrada."
    if platform == "gerar_imagem": return "Recurso Premium: A geração de imagem requer uma API dedicada (ex: DALL-E 3) e não está disponível no plano atual."

    try:
        model = get_model()
        img = Image.open(image_path)
        
        
        prompt_key = f"{platform}_{task}"
        prompt_text = PROMPTS.get(prompt_key, PROMPTS["instagram_legenda"])
        
        full_prompt = prompt_text + "\n\nResponda usando formatação Markdown (negrito, tópicos) para ficar bonito."

        response = await model.generate_content_async([full_prompt, img], stream=False)
        return response.text
    except Exception as e:
         return f"Erro IA: {str(e)}"