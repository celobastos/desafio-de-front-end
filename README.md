# TDSCompany Weather App

Aplicacao Next.js que exibe o clima atual e a previsao do dia para cidades selecionadas.

## Visao Geral

O app tem um fluxo simples:

- a tela inicial lista as cidades disponiveis;
- cada cidade aponta para uma rota propria em `/city/[cityId]`;
- a rota de cidade busca os dados de clima no servidor;
- os dados externos sao validados, normalizados e entregues para componentes de UI;
- o Next.js cuida dos estados de carregamento, erro e pagina nao encontrada pelo App Router.

Essa abordagem mantem a API key no servidor, reduz estado client-side desnecessario e usa o cache nativo do Next para revalidar os dados periodicamente.

## Stack

- Next.js 16 com App Router
- React 19
- TypeScript
- CSS Modules
- Jest e Testing Library
- Docker e Docker Compose
- WeatherAPI.com

## Requisitos

- Node.js 22 ou mais recente para desenvolvimento local
- Docker para executar em container
- Uma chave de API do WeatherAPI.com

## Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
WEATHER_API_KEY=sua_chave_weatherapi_aqui
```

Essa variavel e lida apenas no servidor em `lib/weather/client.ts`.

## Arquitetura

O projeto usa Server Components do Next.js para buscar os dados de clima. Como a cidade selecionada esta na URL, a propria rota define qual informacao precisa ser carregada.

Principios usados:

- **URL como estado principal:** `/city/recife` representa a tela e a cidade selecionada.
- **Busca no servidor:** a WeatherAPI e chamada em `lib/weather/client.ts`, sem expor a API key no browser.
- **UI desacoplada da API externa:** os componentes recebem um modelo interno `WeatherDetails`, nao o payload bruto da WeatherAPI.
- **Validacao na borda da integracao:** `weatherapi-types.ts` valida tipos e campos obrigatorios antes da normalizacao.
- **Cache nativo do Next:** `fetch` usa `next: { revalidate: 300 }`, mantendo os dados por ate 5 minutos antes de revalidar.
- **Sem state manager desnecessario:** Redux, Zustand, Context API ou TanStack Query nao sao necessarios para o fluxo atual.

TanStack Query faria sentido se o app passasse a ter troca de cidade sem navegacao, polling no browser, filtros client-side, dashboards com multiplas consultas compartilhadas ou atualizacoes em background controladas pelo client.

## Data Flow

Fluxo da tela inicial:

```text
Usuario acessa /
  -> app/page.tsx
  -> CitySelector
  -> cities em lib/cities.ts
  -> Link para /city/[cityId]
```

Fluxo da tela de clima:

```text
Usuario acessa /city/recife
  -> app/city/[cityId]/page.tsx
  -> loadCityWeather(cityId)
  -> getCityById(cityId)
  -> getWeatherDetails(cityId)
  -> WeatherAPI.com
  -> parseWeatherApiResponse(payload)
  -> normalizeWeatherResponse(city, payload)
  -> WeatherDetailsView(weather)
```

Fluxo de erro:

```text
cityId inexistente
  -> WeatherApiError com status 404
  -> notFound()
  -> app/not-found.tsx

falha de API, timeout, API key ausente ou payload invalido
  -> WeatherApiError ou erro inesperado
  -> app/city/[cityId]/error.tsx
```

## Estrutura Do Projeto

```text
app/
  page.tsx                         rota inicial com o seletor de cidades
  layout.tsx                       layout raiz da aplicacao
  globals.css                      tokens visuais e estilos globais
  not-found.tsx                    tela para rotas ou cidades inexistentes
  api/health/route.ts              health check HTTP para Docker, Vercel e monitores externos
  city/[cityId]/page.tsx           valida a cidade pela URL e renderiza o clima no servidor
  city/[cityId]/loading.tsx        estado de carregamento da rota de clima
  city/[cityId]/error.tsx          estado de erro da rota de clima

components/
  CitySelector/                    seletor de cidades da tela inicial
  StatusShell/                     componentes compartilhados de loading, erro e acoes
  WeatherAssetIcon/                mapeamento de assets SVG para icones de clima
  WeatherDetailsView/              tela de detalhes do clima
  WeatherDetailsView/CurrentForecast/
                                    temperatura atual e maxima/minima do dia
  WeatherDetailsView/PeriodForecastGrid/
                                    previsao por periodo do dia
  WeatherDetailsView/WeatherMetrics/
                                    metricas de vento, nascer do sol, por do sol e umidade

lib/
  server-logger.ts                 logger server-side com eventos JSON estruturados
  cities.ts                        cidades disponiveis e busca por id
  weather/client.ts                integracao server com a WeatherAPI
  weather/load-city-weather.ts     carregamento da rota com tratamento de 404
  weather/weatherapi-types.ts      validacao do payload externo da WeatherAPI
  weather/normalize.ts             normalizacao dos dados externos para o formato da UI
  weather/icon-mapping.ts          escolha dos icones por condicao climatica
  weather/formatters.ts            formatadores de temperatura e vento
  weather/errors.ts                erro customizado da camada de clima
  weather/types.ts                 tipos internos compartilhados

assets/
  *.svg                            icones usados pela interface
  test-coverage.svg                imagem do relatorio de cobertura usado no README

__tests__/
  health-route.test.ts             testes do endpoint de health check
  CitySelector.test.tsx            testes do seletor de cidades
  WeatherDetailsView.test.tsx      testes da tela de detalhes do clima
  weather.test.ts                  testes de normalizacao, formatacao, icones e validacao
  weather-client.test.ts           testes do cliente da API e carregamento da rota

Dockerfile                         build da aplicacao em container
compose.yaml                       execucao local com Docker Compose
jest.config.mjs                    configuracao da suite de testes
next.config.mjs                    configuracao do Next.js
```

## Caching E Revalidacao

A chamada externa usa:

```ts
next: { revalidate: 300 }
```

Isso significa que o Next pode reutilizar a resposta em cache por 5 minutos. Depois desse periodo, a proxima requisicao pode revalidar os dados no servidor.

Esse modelo e suficiente para uma previsao de clima simples, porque:

- evita chamar a API externa a cada request;
- mantem os dados razoavelmente atualizados;
- nao exige cache manual no browser;
- preserva a API key no servidor.

## Tratamento De Estados

O App Router separa os estados da rota:

- `loading.tsx`: exibido enquanto a rota de clima carrega;
- `error.tsx`: exibido quando a busca ou normalizacao falha;
- `not-found.tsx`: exibido quando a cidade nao existe.

Essa separacao evita colocar estados de loading e erro dentro dos componentes visuais principais.

## Observabilidade

Falhas da integracao de clima geram logs estruturados no servidor usando `lib/server-logger.ts`. Os eventos sao escritos como JSON em `console.error` ou `console.warn`, o que facilita coleta por Docker, plataformas cloud ou ferramentas como Datadog, New Relic, Sentry, Grafana Loki e CloudWatch.

Eventos registrados:

- `weather_city_not_found`: cidade inexistente foi solicitada;
- `weather_api_key_missing`: variavel `WEATHER_API_KEY` nao foi configurada;
- `weather_api_request_error`: falha de rede ou timeout na chamada externa;
- `weather_api_response_error`: WeatherAPI respondeu com status HTTP nao esperado;
- `weather_api_payload_invalid`: payload externo veio incompleto ou fora do formato esperado.

Exemplo de log:

```json
{
  "level": "error",
  "event": "weather_api_response_error",
  "timestamp": "2026-05-28T12:00:00.000Z",
  "cityId": "recife",
  "provider": "weatherapi",
  "status": 503
}
```

Os logs nao incluem a API key nem o payload completo da API externa.

## Health Check

O app expoe um endpoint de liveness em:

```text
GET /api/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "service": "tdscompany-weather-app",
  "timestamp": "2026-05-28T12:00:00.000Z"
}
```

Esse endpoint nao chama a WeatherAPI. Ele valida apenas se a aplicacao esta respondendo HTTP, evitando que uma instabilidade temporaria do provedor externo marque o container ou deploy como indisponivel.

No Docker, o `Dockerfile` e o `compose.yaml` usam esse endpoint como health check:

```text
http://127.0.0.1:3000/api/health
```

No Vercel, o mesmo endpoint fica disponivel na URL do deploy:

```text
https://seu-dominio-da-vercel.vercel.app/api/health
```

Ele pode ser usado por monitores externos como UptimeRobot, Better Stack, Datadog, Grafana Cloud ou New Relic.

## Rodar Localmente

Instale as dependencias:

```bash
npm ci
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Rodar Com Docker

Antes de construir a imagem, confira se o Docker Desktop esta aberto e em execucao.

Construa a imagem:

```bash
docker build -t tdscompany-weather-app .
```

Rode o container:

```bash
docker run --rm -p 3000:3000 --env-file .env.local tdscompany-weather-app
```

Acesse `http://localhost:3000`.

Ou use Docker Compose:

```bash
docker compose up --build
```

Para acompanhar o status do health check no Docker Compose:

```bash
docker compose ps
```

## Build De Producao

Crie o build de producao:

```bash
npm run build
```

Rode o servidor de producao:

```bash
npm run start
```

## Testes

Rode a suite de testes:

```bash
npm test
```

Para verificar a cobertura dos testes:

```bash
npx jest --coverage
```

A suite cobre:

- renderizacao dos componentes principais;
- links e rotas das cidades;
- normalizacao dos dados de clima;
- validacao do payload externo;
- formatadores;
- mapeamento de icones;
- busca de cidades;
- endpoint de health check;
- fluxos de sucesso e erro do cliente da WeatherAPI;
- logs estruturados para falhas da integracao externa;
- tratamento de `notFound` para cidades inexistentes.

Resultado atual da cobertura:

![Relatorio de cobertura dos testes](./assets/test-coverage.svg)

## Decisoes Tecnicas

- **Server Components em vez de TanStack Query:** o dado depende diretamente da rota e pode ser carregado no servidor.
- **API externa isolada em `lib/weather`:** facilita testes, tratamento de erro e troca futura de provedor.
- **Payload externo validado manualmente:** evita que dados incompletos da API quebrem a UI silenciosamente.
- **CSS Modules:** mantem estilos proximos aos componentes sem criar dependencias adicionais.
- **Testes focados na regra de negocio:** normalizacao, formatacao, mapeamento e cliente da API ficam cobertos por testes unitarios.

## Possiveis Melhorias Futuras

- permitir unidade Fahrenheit/Celsius como preferencia do usuario;
- adicionar refresh manual na tela de clima;
- migrar para API route + TanStack Query se houver necessidade real de comportamento client-side mais interativo.
