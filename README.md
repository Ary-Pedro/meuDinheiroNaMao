# meuDinheiroNaMao

AplicaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o web de **controle financeiro pessoal** construÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­da como um **monÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³lito fullstack ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºnico**, responsivo **mobile-first**, com frontend e backend no mesmo app e arquitetura em camadas:

`UI -> Controller -> Service -> Repository/Model -> Database`

O produto cobre desde o MVP trÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªs contextos funcionais separados:

- **financeiro real**
- **investimentos**
- **simulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes isoladas**

> O foco principal continua sendo o **controle financeiro pessoal**, mas jÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ com cobertura de **patrimÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´nio/investimentos** desde o MVP e com **simulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes separadas dos dados reais**.

---

## VisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o do produto

O **meuDinheiroNaMao** nasce para centralizar a vida financeira pessoal em um ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºnico sistema, organizado em trÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªs domÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nios funcionais complementares.

### 1. Controle financeiro real
ResponsÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡vel pelo acompanhamento do dia a dia financeiro:

- receitas
- despesas
- transferÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias
- custos fixos e variÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡veis
- contas financeiras
- saldo e visÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o consolidada do perÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­odo

### 2. Investimentos
ResponsÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡vel pela visÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o patrimonial e pelos movimentos de investimento:

- aportes
- posiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes por ativo, classe ou categoria
- evoluÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o patrimonial
- visÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o consolidada de patrimÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´nio
- agregaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes especÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­ficas de investimento

### 3. SimulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
ResponsÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡vel por cenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios hipotÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©ticos e projeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes sem afetar a base real:

- cenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios isolados
- projeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes financeiras
- comparaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o entre estratÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©gias
- testes de fluxo futuro
- anÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡lises sem contaminar o histÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rico real

---

## PrincÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­pios e contratos do produto

### Arquitetura oficial do sistema

`UI -> Controller -> Service -> Repository/Model -> Database`

### SeparaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o funcional obrigatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³ria

O sistema deve manter separaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o explÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­cita entre:

- **dados reais**
- **investimentos**
- **simulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes**

### Regra de IA

A IA:

- interpreta dados consolidados
- apoia insights e explicaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
- **nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o cria verdade primÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ria**
- **nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o substitui a regra de negÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³cio**

### Regra do Client Service

O **Client Service**:

- ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© uma expansÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o futura
- fica **fora do nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºcleo inicial do MVP**
- entra como **origem de captura**, nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o como regra central do sistema

---

## Arquitetura oficial

O projeto estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ oficialmente definido como um **monÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³lito fullstack ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºnico**, implementado com **Next.js fullstack + App Router**, mantendo frontend e backend no mesmo projeto e separaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o lÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³gica interna por camadas.

### Camadas do monÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³lito

#### UI
- coleta entrada do usuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio
- renderiza telas, formulÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios, listas, dashboards e grÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ficos
- trata estados de loading, vazio, erro e sucesso
- prioriza experiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia responsiva mobile-first

#### Controller
- recebe requests da UI
- valida entrada
- orquestra request/response
- encaminha o fluxo para os services corretos

#### Service
- aplica regra de negÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³cio
- calcula mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tricas e agregaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
- separa fluxos de financeiro real, investimentos e simulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
- prepara dados para dashboards, relatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rios e IA

#### Repository / Model
- define estruturas e contratos do domÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nio
- organiza acesso ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  persistÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia
- encapsula leitura e escrita no banco

#### Database
- armazena dados transacionais e histÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³ricos
- preserva integridade entre contextos
- sustenta consultas, agregaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes e auditoria de dados

### DecisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o arquitetural fechada

- **Modelo do sistema:** monÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³lito fullstack
- **Framework principal:** Next.js com App Router
- **Sem ambiguidade de backend:** nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o hÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ alternativa aberta entre Next.js API e NestJS
- **SeparaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o interna:** por camadas e por mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³dulos de domÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nio dentro do mesmo app

---

## MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³dulos e domÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nios do monÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³lito

O sistema serÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ organizado conceitualmente em quatro mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³dulos principais:

### `finance`
- transaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes reais
- contas financeiras
- categorias e subcategorias
- saldo e consolidaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o operacional
- dashboard financeiro

### `investments`
- aportes
- ativos
- posiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
- evoluÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o patrimonial
- visÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o consolidada de patrimÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´nio

### `simulations`
- cenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios hipotÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©ticos
- projeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
- comparaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
- resultados isolados do real

### `shared`
- autenticaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o
- usuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios
- componentes compartilhados
- utilitÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios
- contratos comuns
- integraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes transversais

---

## Fluxo de responsabilidade por camada

Cada requisiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o deve seguir o seguinte fluxo de responsabilidade:

1. **UI** coleta entrada e renderiza a saÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­da
2. **Controller** valida e orquestra request/response
3. **Service** aplica a regra de negÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³cio
4. **Repository** acessa a persistÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia
5. **Model** define a estrutura e os contratos do domÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nio
6. **Database** armazena e recupera os dados

---

## SeparaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de persistÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia por contexto

A modelagem conceitual deve manter separaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o clara de persistÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia entre os contextos abaixo:

### Contexto `real`
- transaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes financeiras reais
- contas reais
- categorias reais
- mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tricas operacionais e saldo

### Contexto `investment`
- aportes
- posiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
- movimentaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes patrimoniais
- consolidaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o e evoluÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o da carteira

### Contexto `simulation`
- cenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios hipotÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©ticos
- parÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢metros informados pelo usuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio
- projeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes calculadas
- comparaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes de resultado

### Regras obrigatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rias
- **simulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o viram transaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes reais**
- **simulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o contaminam saldo, patrimÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´nio real ou dashboards operacionais**
- **investimentos tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªm fluxo prÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³prio e agregaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes prÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³prias**
- **investimento nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o deve ser tratado como despesa comum por padrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o**

---

## Escopo do MVP

O MVP jÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ inclui os trÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªs domÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nios do produto, com foco principal em financeiro pessoal e cobertura inicial de patrimÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´nio e cenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios.

### Funcionalidades do MVP
- cadastro manual de transaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
- contas financeiras
- categorias e subcategorias
- dashboard
- importaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o
- revisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o
- insights
- **mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³dulo bÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡sico de investimentos**
- **mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³dulo de simulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes jÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ no MVP, mas isolado do real**

### Regras importantes do MVP
- **simulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o viram transaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes reais**
- **investimentos possuem fluxo e agregaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes prÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³prios**
- **dados reais, investimentos e simulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes permanecem separados por contexto**
- o **Sankey** continua como uma **visÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o avanÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ada**, nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o como requisito central da primeira entrega

### VisualizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes previstas
- resumo financeiro do perÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­odo
- gastos por categoria
- evoluÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de saldo
- comparaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o entre receitas e despesas
- visÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o consolidada de patrimÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´nio
- evoluÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de investimentos
- cenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios simulados lado a lado
- Sankey financeiro como visualizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o avanÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ada

---

## ExperiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia do produto

### DireÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de UX
- **mobile-first**
- responsivo para celular, tablet e desktop
- foco em clareza, rapidez e baixo esforÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§o cognitivo
- aÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes principais visÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­veis: adicionar, importar, revisar e analisar
- maior densidade de informaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o no desktop para leitura analÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­tica

### Uso por plataforma
- **mobile:** lanÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§amento rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pido, consulta, revisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o e leitura de resumo
- **desktop:** anÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡lise detalhada, filtros, grÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ficos, patrimÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´nio e simulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes

---

## Papel da IA

A IA serÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ usada para:

- resumir perÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­odos financeiros
- identificar padrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes e tendÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias
- sugerir insights sobre comportamento financeiro e patrimonial
- explicar dados jÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ consolidados pelo sistema
- apoiar geraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de textos analÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­ticos para dashboards

### Contrato da IA
- recebe dados estruturados pelo sistema
- nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o inventa transaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
- nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o cria saldo fictÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­cio
- nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o altera a verdade primÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ria do sistema
- depende de dados consolidados por regras explÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­citas da aplicaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o

---

## Client Service futuro

O projeto jÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ deve nascer preparado para uma futura integraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o com um **Client Service local** no computador do usuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio.

Esse componente poderÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡, no futuro:

- rodar em background
- capturar dados brutos localmente
- apoiar automaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes assistidas
- servir como origem adicional de importaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o e revisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o

### Regra de integraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o

O **Client Service** serÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ tratado como **origem externa de captura**, e nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o como o centro da regra de negÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³cio do produto.

---

## Fora do escopo inicial

- automaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o bancÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ria complexa como fluxo principal
- scraping bancÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio como nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºcleo do MVP
- decisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes automÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ticas sem revisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o humana
- criaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o automÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tica de verdade financeira pela IA
- dependÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia do Client Service para operaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o bÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡sica do sistema

---

## Diagramas

### Atores e casos de uso

```mermaid
flowchart LR
    U[UsuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio]
    IA[ServiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§o de IA]
    CS[Client Service Futuro]

    UC1[Registrar transaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes reais]
    UC2[Importar dados]
    UC3[Revisar lanÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§amentos]
    UC4[Gerenciar investimentos]
    UC5[Criar simulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes]
    UC6[Visualizar dashboard]
    UC7[Visualizar Sankey e grÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ficos avanÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ados]
    UC8[Receber insights]

    U --> UC1
    U --> UC2
    U --> UC3
    U --> UC4
    U --> UC5
    U --> UC6
    U --> UC7
    U --> UC8

    IA -. interpreta dados consolidados .-> UC8
    CS -. origem futura de captura .-> UC2
```

### Arquitetura em camadas

```mermaid
flowchart LR
    UI[UI\nNext.js App Router]
    C[Controller]
    S[Service]
    RM[Repository / Model]
    DB[(Database)]

    UI --> C --> S --> RM --> DB
```

### MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³dulos do sistema

```mermaid
flowchart TD
    APP[MonÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³lito Fullstack Carteira]

    APP --> F[Financeiro Real]
    APP --> I[Investimentos]
    APP --> SIM[SimulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes]
    APP --> AI[IA]
    APP --> CS[Client Service Futuro]
    APP --> SH[Shared]

    F --> F1[Receitas, despesas e transferÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias]
    F --> F2[Contas, categorias e dashboard]

    I --> I1[Aportes e posiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes]
    I --> I2[EvoluÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o patrimonial]

    SIM --> S1[CenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios isolados]
    SIM --> S2[ProjeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes e comparaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes]
```

### Fluxo de dados por contexto

```mermaid
flowchart TD
    E[Entrada do usuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio]

    E --> T1[TransaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o real]
    E --> T2[Dado de investimento]
    E --> T3[CenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio simulado]

    T1 --> FS[Finance Service]
    T2 --> IS[Investment Service]
    T3 --> SS[Simulation Service]

    FS --> DB1[(PersistÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia real)]
    IS --> DB2[(PersistÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia investment)]
    SS --> DB3[(PersistÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia simulation)]

    DB1 --> D1[Dashboard financeiro]
    DB2 --> D2[VisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o patrimonial]
    DB3 --> D3[VisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de cenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios]

    DB1 -. dados consolidados .-> IA2[Camada de IA]
    DB2 -. dados consolidados .-> IA2
    IA2 -. insights interpretativos .-> D1
    IA2 -. insights interpretativos .-> D2
```

---

## Stack definida

A stack oficial do projeto fica fixada em:

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **PostgreSQL**
- **Prisma**
- **Recharts / Nivo**
- **OpenAI API**

---

## ExecuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o local com Docker

Para subir a aplicaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o e o banco com um ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºnico comando:

```bash
docker compose up --build
```

Depois disso:

- aplicaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

### Acesso pelo celular na mesma rede

O endereÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§o `0.0.0.0` **nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© um link de navegaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o**; ele apenas indica que o servidor estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ escutando em todas as interfaces da mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡quina host.

Para abrir no celular, use o **IPv4 local do computador** na mesma rede Wi-Fi. Exemplo:

```bash
http://SEU_IP_LOCAL:3000/finance
```

Exemplo real de uso:

```bash
http://10.10.10.93:3000/finance
```

> O celular e o computador precisam estar na **mesma rede**, e a porta `3000` precisa estar liberada no firewall local.

### IP mostrado no log do Docker

O banner do container usa a variÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡vel abaixo para mostrar a URL de rede correta:

```bash
APP_PUBLIC_URL="http://10.10.10.93:3000"
```

Se o IP da sua mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡quina mudar, atualize essa variÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡vel no `.env` e rode novamente:

```bash
docker compose up --build
```

### Comportamento do container da aplicaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o

Ao subir com Docker, o serviÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§o da aplicaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o:

1. aguarda o PostgreSQL ficar saudÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡vel
2. aplica as migrations do Prisma
3. executa o seed idempotente do usuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio demo
4. inicia o Next.js em `0.0.0.0:3000`

---

## Roadmap

### 1. Base monolÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­tica + autenticaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o + financeiro real
- estrutura do monÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³lito fullstack
- autenticaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o
- arquitetura em camadas
- mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³dulo de financeiro real

### 2. ImportaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o + revisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o
- importaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de extratos e arquivos
- normalizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de entrada
- deduplicaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o assistida
- revisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o manual

### 3. Investimentos
- cadastro de aportes
- ativos e posiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
- visÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o patrimonial consolidada

### 4. SimulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes isoladas
- criaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de cenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rios
- projeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
- comparaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes sem afetar dados reais

### 5. Insights e visualizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes avanÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§adas
- insights com IA
- grÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ficos avanÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ados
- Sankey financeiro

### 6. Client Service futuro
- client service local
- captura assistida
- novas origens de dados externas ao nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºcleo inicial

---

## Resumo executivo

O **Carteira** estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ definido como um **monÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³lito fullstack ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºnico**, responsivo **mobile-first**, implementado com **Next.js + TypeScript + Tailwind + PostgreSQL + Prisma**, seguindo a arquitetura oficial:

`UI -> Controller -> Service -> Repository/Model -> Database`

O produto separa formalmente trÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªs contextos de negÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³cio:

- **financeiro real**
- **investimentos**
- **simulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes isoladas**

A IA atua como camada interpretativa sobre dados consolidados, e o **Client Service** permanece como expansÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o futura, fora do nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºcleo inicial do MVP.
