# Mileny Matos + Método SER

Site estático e responsivo de Mileny Matos — jornalista, professora, terapeuta integrativa e criadora do **Método SER** (Salto para o Equilíbrio e Realização).

## Páginas

- `index.html` — Mileny Matos: apresentação, sobre, resumo do método, trajetória, atendimento, reflexões, FAQ e contato.
- `metodo-ser.html` — Método SER: três pilares, sete movimentos, abordagem, para quem é, sustentação e convite.
- `roda-do-ser.html` — Roda do SER (página das campanhas): os seis papéis em roda interativa, prévia com 6 das 24 frases, perfis e stories, os quatro desenhos da roda, Conversa de Clareza e FAQ. O botão "Fazer minha roda" leva ao app em https://milenymatos.github.io/roda-do-ser/.

## Estrutura

```
assets/
  css/style.css   # sistema visual (cores, tipografia, layout, animações)
  js/main.js      # interações: cortina, reveals, contadores, timeline, carrossel, FAQ
  js/roda-ser.js  # rodas da Roda do SER (dados e geometria do app), explorador e prévia interativa
  img/            # fotos em WebP (original + versão 800px para srcset)
```

Sem build nem dependências: basta servir os arquivos estáticos (GitHub Pages, Vercel, Netlify etc.).
Para testar localmente: `python3 -m http.server` e abra http://localhost:8000.

Base visual: Dossiê Visual Mileny Matos v1.0.
