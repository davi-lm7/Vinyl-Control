# Vinyl Control — Web

Interface web estática do Vinyl Control, feita com HTML, CSS e JavaScript puro.

## Executar

1. Inicie a API em outro terminal:

   ```bash
   cd api
   npm start
   ```

2. Sirva a pasta `web` com o Live Server ou outro servidor estático e abra `index.html`.

A aplicação usa `http://<host-da-página>:3000` por padrão. Assim, tanto `localhost` quanto o IP local funcionam sem alterar código. Para outro endereço, inclua antes de `js/api.js`:

```html
<script>window.VINYL_API_URL = "http://servidor:porta";</script>
```

## Integração

| Função | Endpoint |
|---|---|
| Login | `POST /usuarios/login` |
| Discos | `GET`, `POST /discos`; `GET`, `PUT`, `DELETE /discos/:id` |
| Movimentações | `GET`, `POST /movimentacoes` |

O cadastro de discos pede título, artista, gênero, preços de custo e venda, quantidade e estoque mínimo — os campos exigidos pela API.
