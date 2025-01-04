# Gerenciador de Grade de Horários Escolar

## Descrição
Este projeto é uma aplicação web para gerenciar e gerar grades de horários escolares de forma eficiente. A interface permite a configuração de turnos, aulas, turmas, e professores, além de gerar a grade visualmente e exportá-la para PDF em formato paisagem.

## Funcionalidades

### Configuração Geral
- Configurar turnos (matutino, vespertino e noturno) com horários de início e fim.
- Definir a duração das aulas e a quantidade de recreios.
- Adicionar informações sobre as turmas (séries e classes).
- Cadastrar professores e associá-los a disciplinas.

### Grade de Horários
- Gerar a grade de horários completa com base nas configurações realizadas.
- Ajustar automaticamente para a proporção 16:9 e exportar em formato PDF.
- Divisão automática em múltiplas páginas no PDF se a altura da grade exceder a de uma página A4.

### Gerenciamento de Dados
- Salvar dados no cache do navegador para recuperação posterior.
- Limpar todos os dados salvos com um único clique.
- Verificar conflitos de horários entre professores e apresentar sugestões de resolução.

## Tecnologias Utilizadas
- **HTML5**: Estrutura da interface.
- **CSS3**: Estilização responsiva com suporte a telas maiores e dispositivos móveis.
- **JavaScript**: Funcionalidades dinâmicas para manipulação da grade e geração de PDF.
- **Bibliotecas externas**:
  - [jsPDF](https://github.com/parallax/jsPDF): Para gerar PDFs.
  - [html2canvas](https://html2canvas.hertzen.com/): Para capturar a grade como imagem antes de gerar o PDF.

## Instalação e Uso

### Requisitos
- Navegador atualizado com suporte a JavaScript.

### Passos
1. Clone ou faça o download deste repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```
2. Abra o arquivo `index.html` em qualquer navegador moderno.

### Gerar PDF
- Configure os turnos, turmas, professores e gere a grade.
- Clique no botão **"Gerar PDF"** para exportar a grade.

## Estrutura do Projeto

```
├── index.html        # Arquivo principal do projeto
├── styles.css        # Estilos da aplicação
├── script.js         # Funcionalidades dinâmicas
└── README.md         # Documentação do projeto
```

## Funcionalidades em Destaque

### Responsividade
- Suporte para dispositivos móveis e tablets.
- Layout adaptado para proporção 16:9, ideal para exibição em telas maiores e PDFs.

### Geração de PDF
- O conteúdo da grade é capturado e renderizado para caber completamente na largura de uma folha A4 no formato paisagem.
- Altura excedente é automaticamente dividida em múltiplas páginas.

### Verificação de Conflitos
- Identifica choques de horários entre professores e apresenta sugestões para resolução.

## Estilo e Design
- Interface intuitiva e moderna.
- Botões com feedback visual para melhor usabilidade.
- Estrutura de grade clara e bem organizada.

## Possíveis Melhorias
- Integração com banco de dados para armazenamento permanente.
- Adicionar funcionalidade para importar/exportar configurações em formatos como JSON.
- Implementar sistema de login para múltiplos usuários.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

