# Metas Empreendimentos

FASE 01 - Dashboard + Tela de Consulta de Clientes

Objetivo

Você é um UX/UI Designer Senior e Desenvolvedor Full Stack especialista em sistemas ERP e CRM corporativos.

Seu trabalho é criar apenas a primeira etapa do sistema da Metas Representações, sem desenvolver os demais módulos.

Nesta primeira fase desenvolva somente:

 Layout principal do sistema (Dashboard)

 Sidebar

 Header

 Sistema de navegação

 Tela de Consulta de Clientes

Não desenvolva nenhuma outra tela.

Tecnologia

Utilize:

 React

 TypeScript

 TailwindCSS

 shadcn/ui

 Lucide Icons

Código limpo e organizado.

Todos os componentes deverão ser reutilizáveis.

Estilo

Criar um sistema moderno inspirado em:

 SAP Fiori

 Hubspot CRM

 Salesforce Lightning

 Notion

 Linear

Misturando aparência corporativa com alta usabilidade.

Não criar aparência antiga de ERP.

O sistema deve transmitir:

 organização

 velocidade

 produtividade

 grande quantidade de dados sem poluição visual

Layout

Estrutura:

-------------------------------------------------------
Sidebar | Header
        |
        | Breadcrumb
        |
        | Cards de resumo
        |
        | Barra de ações
        |
        | Área de filtros
        |
        | Grid/Listagem
-------------------------------------------------------

Sidebar

Itens do menu:

Dashboard

Pessoal

 Clientes

 Representadas

 Transportadoras

 Vendedores

 Referências Comerciais

Vendas

 Produtos

 Tabelas de Preços

 Orçamentos

 Pedidos

 Notas Fiscais

 Duplicatas

Utilitários

 Usuários

 Perfis

 Configurações

Cada item deve possuir ícone.

Menus recolhíveis.

Sidebar recolhível.

Header

No topo criar:

Campo de pesquisa global

Botão de notificações

Botão ajuda

Avatar do usuário

Menu do usuário

Tema claro/escuro

Dashboard Inicial

Criar apenas um dashboard visual.

Cards:

Clientes cadastrados

Representadas

Pedidos do mês

Vendas do mês

Comissões

Pedidos pendentes

Gráfico fictício de vendas

Lista de atividades recentes

Estes dados são apenas demonstrativos.

Tela Clientes

Esta será a tela principal desta fase.

Ela representa uma tela de consulta.

Deve conter:

Título:

Clientes

Descrição:

Consulta e gerenciamento de clientes cadastrados.

Barra de ações

Botão Novo Cliente

Editar

Excluir

Ativar

Inativar

Exportar Excel

Importar Excel

Imprimir Relatório

Atualizar

Área de filtros

Filtros rápidos:

Código

Razão Social

Nome Fantasia

CNPJ

Vendedor

Cidade

Estado

Situação

Período de cadastro

Botão:

Pesquisar

Limpar filtros

Os filtros deverão ficar dentro de um Card.

Listagem

Tabela moderna.

Colunas:

Código

Razão Social

Nome Fantasia

CNPJ

Cidade

UF

Telefone

Vendedor

Situação

Cadastro

Última alteração

Ações

Na coluna Situação utilizar badges:

Verde

Ativo

Cinza

Inativo

Na coluna ações utilizar ícones:

Visualizar

Editar

Duplicar

Mais opções

Paginação

Rodapé contendo:

Quantidade de registros

Página atual

Itens por página

Anterior

Próximo

Busca

A busca deve ser instantânea.

Filtros combináveis.

Preparar estrutura para futura integração com API.

UX

Utilizar:

Hover

Loading

Skeleton

Estados vazios

Sem resultados

Confirmação de exclusão

Toast notifications

Tooltips

Responsividade completa.

Componentização

Criar componentes independentes para:

Sidebar

Header

Cards

Tabela

Filtro

Paginação

Botões

Modal

Badge

Input

Select

Data Picker

Breadcrumb

Responsividade

Desktop

Notebook

Tablet

Mobile

A sidebar deve virar Drawer no mobile.

Dados

Utilizar dados fictícios.

Criar aproximadamente 30 clientes simulados.

Importante

Nesta fase NÃO criar:

Cadastro do Cliente

Tela de edição

Representadas

Transportadoras

Vendedores

Pedidos

Produtos

Notas fiscais

Duplicatas

Login

Backend

Banco de dados

APIs

Autenticação

Criar apenas o layout navegável e funcional da interface.

Acrescentei a Fase 2, que contempla o Cadastro Completo de Clientes, mantendo o mesmo Design System criado na Fase 1.

A Fase 2 inclui:

 Tela de Novo Cliente

 Tela de Editar Cliente

 Tela de Visualização

 Organização por abas:

 Dados Gerais

 Informações Financeiras

 Contatos

 Sócios

 Referências Comerciais

 Endereços

 Todos os campos descritos no documento:

 Código automático

 Razão Social

 Nome Fantasia

 CNPJ

 IE

 IM

 E-mails

 Telefones

 Vendedor

 Situação

 Observações

 Dados bancários

 Contatos ilimitados

 Sócios

 Referências comerciais

 Múltiplos endereços tipificados

 Máscaras e validações

 Componentização

 Responsividade

 Dados mockados (sem backend)

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://metas-representacoes.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5a0ece98-3e4a-4a17-b4ea-6db608b14cfd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
