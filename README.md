# LP Sinergia — 2 páginas, 1 projeto V8

- `index.html`  → **clientes** (venda): simulador de economia na conta de luz + SI Conecta (rastreamento) + formulário.
- `lider/index.html` → **líderes / revendedores**: oportunidade de Corretor/Líder, botões levam ao seu link do office.
- `privacidade.html` → modelo de política de privacidade (revise antes de anunciar).
- `js/v8-loader.js` → seu V8 Loader (versão atual).

## Como colocar no ar
1. Painel V8 › Projetos › **Novo projeto** (ex.: "LP Sinergia"). Salve e use **Copiar ID** (aba Geral).
2. Troque `ID_DO_PROJETO` pelo ID nos 3 arquivos: `index.html`, `lider/index.html`, `privacidade.html` (mesmo ID nos três).
3. Preencha no painel (Projeto):
   - **Contato:** WhatsApp (os botões e a mensagem pronta usam ele).
   - **Redes:** Instagram.
   - **Conteúdo:** Nome, Profissão ("Corretor Sinergia"), **Link do office** (todos os botões de cadastro) e **Foto de perfil** (URL).
   - **Rastreamento:** ID do **Pixel da Meta** (o loader injeta o Pixel e dispara PageView/Lead/Contact).
4. Publique a pasta no Cloudflare Pages (ou GitHub Pages). A URL da página de líderes fica `seudominio.com/lider/`.

## Anúncios no Meta
- Página de clientes → campanha de **Leads/Mensagens**: evento **Lead** (formulário) e **Contact** (clique no WhatsApp).
- Página de líderes → evento **Lead** e o evento personalizado **ClickCadastro** (clique no link do office).
- O loader guarda `utm_*` e `fbclid` e anexa ao lead (aba Leads) junto com a página de origem e o campo `origem` (cliente/lider).
- Use `?utm_source=meta&utm_campaign=...` na URL dos anúncios.

## Antes de anunciar (importante)
- Peça autorização por escrito à Sinergia para usar logo, artes e os números/percentuais nas suas páginas e anúncios.
- Para a página de líderes, o Meta não permite promessas de renda irrealistas; o texto já deixa claro que não há garantia de ganhos. Não adicione frases como "ganhe R$ X".
- A lista de percentuais por estado vem do site oficial (lista pública). O item "SS 16%" do site parece erro de digitação e ficou de fora; estados sem dado aparecem como "consultar".
- Troque os textos de contato do rodapé/privacidade conforme seus dados.
