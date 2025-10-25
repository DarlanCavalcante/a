# Copilot Instructions – Alimentação Solidária

## Project Overview
Site estático (HTML, CSS e JS) de uma ONG fictícia focada no combate à fome e segurança alimentar. Marca atual: "Alimentação Solidária".

## Architecture & Structure
- Páginas: `index.html` (início), `projeto.html` (projetos), `cadastro.html` (cadastro de voluntários)
- Cabeçalho/rodapé idênticos em todas as páginas; nav inclui imagem `imagem/voluntario.jpg` ao lado do nome da ONG
- Imagens em `imagem/`
- Estilos centralizados em `style.css` com gradiente primário (#667eea → #764ba2), botões reutilizáveis e layout flex

## Key Patterns & Conventions

### HTML
- Navegação com logo (imagem + texto) e link "Seja Voluntário" estilizado como botão `.btn-secondary`
- `.active` marca a página atual
- Seções hero usam `.hero`; conteúdo principal em `.about`, `.cta`, `.contact`
- Formulário em `cadastro.html` usa `<fieldset>`/`<legend>` e possui mensagem de sucesso `#successMessage`

### CSS
- Cores: gradiente principal #667eea → #764ba2; botões `.btn-primary`/`.btn-secondary` com hover e pseudo-elemento `::after`
- Tipografia: Segoe UI; `line-height: 1.6`
- Layout: flexbox; containers até 1200px; header fixo com sombra
- Regras específicas no nav deixam os botões mais compactos

### JavaScript
- Arquivo único: `script.js` (importado em todas as páginas)
- Funções:
  - `toggleMenu()`: alterna a visibilidade do menu em telas pequenas
  - `handleSubmit(event)`: valida o formulário e exibe `#successMessage`

### Form Handling
- Registration form (`cadastro.html`) includes validation and success messaging
- Uses semantic fieldsets: "Dados Pessoais", "Disponibilidade", "Informações Adicionais"
- Success message element exists but requires JavaScript to display: `#successMessage`

## Development Workflows

### File Naming Consistency
When adding JavaScript functionality, ensure `script.js` exists or update HTML references to `index.js`

### Responsive Design Gap
The CSS lacks mobile responsiveness despite having `menu-toggle` buttons. Consider adding:
```css
@media (max-width: 768px) {
  /* Mobile navigation styles */
}
```

### Formulário de voluntários
`cadastro.html` chama `handleSubmit(event)` no `<form>`:
1. previne envio padrão
2. usa validação nativa do browser (`checkValidity/reportValidity`)
3. exibe `#successMessage` e faz `reset()` do formulário

## Arquivos-chave
- `style.css`: componentes (botões, hero), header fixo, classes utilitárias
- `script.js`: `toggleMenu`, `handleSubmit`
- `cadastro.html`: formulário com fieldsets e mensagem `#successMessage`
- `imagem/`: `voluntario.jpg` (logo no nav), `teste.jpg`

## Tarefas comuns
- Criar novas páginas copiando header/rodapé e importando `style.css` + `script.js`
- Reusar `.btn-primary`/`.btn-secondary` e estrutura `.hero`
- Melhorar responsividade: adicionar media queries para o menu mobile se necessário
- Expandir projetos em `projeto.html` mantendo o padrão de cards em `.impact-cards`