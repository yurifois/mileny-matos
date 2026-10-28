# Mileny Matos + Método SER

Site estático e responsivo de Mileny Matos — jornalista, professora, terapeuta integrativa e criadora do **Método SER** (Salto para o Equilíbrio e Realização).

## Páginas

- `index.html` — Mileny Matos: apresentação, sobre, resumo do método, trajetória, atendimento, reflexões, FAQ e contato.
- `metodo-ser.html` — Método SER: três pilares, sete movimentos, abordagem, para quem é, sustentação e convite.

## Estrutura

```
assets/
  css/style.css   # sistema visual (cores, tipografia, layout, animações)
  js/main.js      # interações: cortina, reveals, contadores, timeline, carrossel, FAQ
  img/            # fotos em WebP (original + versão 800px para srcset)
```

Sem build nem dependências: basta servir os arquivos estáticos (GitHub Pages, Vercel, Netlify etc.).
Para testar localmente: `python3 -m http.server` e abra http://localhost:8000.

Base visual: Dossiê Visual Mileny Matos v1.0.
