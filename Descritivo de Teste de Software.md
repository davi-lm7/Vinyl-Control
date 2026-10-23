**Descritivo de Teste de Software**



\## 8.1. Casos de Teste



Os testes de software do sistema \*\*Vinyl Control\*\* têm como objetivo verificar o funcionamento das principais funcionalidades da aplicação, garantindo que os usuários consigam realizar a autenticação, cadastrar usuários, gerenciar discos e controlar as movimentações de estoque.



Os testes foram planejados com abordagem manual, utilizando o Insomnia para testar os endpoints da API e o navegador para verificar o acesso à aplicação pelo ambiente local.



\### CT01 — Verificar acesso à tela de autenticação



\- \*\*Caso de Teste ID:\*\* CT01

\- \*\*Requisito Funcional:\*\* RF01.1

\- \*\*Descrição:\*\* Verificar se a interface de autenticação solicita e-mail e senha.

\- \*\*Pré-condições:\*\* A aplicação deve estar em execução e acessível pelo navegador.

\- \*\*Passos:\*\*

&nbsp; 1. Abrir o navegador.

&nbsp; 2. Acessar a aplicação pelo endereço local configurado.

&nbsp; 3. Verificar se os campos de e-mail e senha estão disponíveis.

\- \*\*Resultado Esperado:\*\* A interface deve apresentar os campos necessários para realizar a autenticação.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT02 — Realizar login com credenciais válidas



\- \*\*Caso de Teste ID:\*\* CT02

\- \*\*Requisito Funcional:\*\* RF01.2

\- \*\*Descrição:\*\* Verificar se o sistema permite o acesso com e-mail e senha válidos.

\- \*\*Pré-condições:\*\* Deve existir um usuário cadastrado no banco de dados.

\- \*\*Passos:\*\*

&nbsp; 1. Abrir o Insomnia.

&nbsp; 2. Criar uma requisição POST para `http://localhost:3000/usuarios/login`.

&nbsp; 3. Selecionar o formato JSON no corpo da requisição.

&nbsp; 4. Informar um e-mail cadastrado e a senha correspondente.

&nbsp; 5. Enviar a requisição.

\- \*\*Resultado Esperado:\*\* A API deve retornar o status HTTP 200 e os dados básicos do usuário autenticado.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT03 — Tentar login com e-mail não cadastrado



\- \*\*Caso de Teste ID:\*\* CT03

\- \*\*Requisito Funcional:\*\* RF01.2

\- \*\*Descrição:\*\* Verificar se o sistema impede o login quando o e-mail não está cadastrado.

\- \*\*Pré-condições:\*\* A API deve estar em execução.

\- \*\*Passos:\*\*

&nbsp; 1. Criar uma requisição POST para `http://localhost:3000/usuarios/login`.

&nbsp; 2. Informar um e-mail inexistente e uma senha qualquer.

&nbsp; 3. Enviar a requisição.

\- \*\*Resultado Esperado:\*\* A API deve retornar o status HTTP 401 e a mensagem informando que o e-mail não está cadastrado.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT04 — Cadastrar um novo usuário



\- \*\*Caso de Teste ID:\*\* CT04

\- \*\*Requisito Funcional:\*\* RF02.1

\- \*\*Descrição:\*\* Verificar se a API permite cadastrar um usuário com nome, e-mail e senha.

\- \*\*Pré-condições:\*\* A API e o banco de dados devem estar disponíveis, e o e-mail utilizado não pode estar cadastrado.

\- \*\*Passos:\*\*

&nbsp; 1. Criar uma requisição POST para `http://localhost:3000/usuarios`.

&nbsp; 2. Enviar um JSON contendo nome, e-mail e senha.

&nbsp; 3. Verificar o código de resposta e os dados retornados.

&nbsp; 4. Consultar o banco de dados para confirmar o cadastro.

\- \*\*Resultado Esperado:\*\* A API deve retornar o status HTTP 201, confirmar o cadastro e não expor a senha na resposta.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT05 — Impedir cadastro de usuário com e-mail duplicado



\- \*\*Caso de Teste ID:\*\* CT05

\- \*\*Requisito Funcional:\*\* RF02.1

\- \*\*Descrição:\*\* Verificar se o sistema impede o cadastro de dois usuários com o mesmo e-mail.

\- \*\*Pré-condições:\*\* Deve existir um usuário cadastrado com o e-mail utilizado no teste.

\- \*\*Passos:\*\*

&nbsp; 1. Criar uma requisição POST para `http://localhost:3000/usuarios`.

&nbsp; 2. Informar o mesmo e-mail já cadastrado.

&nbsp; 3. Enviar a requisição.

\- \*\*Resultado Esperado:\*\* A API deve retornar o status HTTP 409 e informar que o e-mail já está cadastrado.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT06 — Listar discos cadastrados



\- \*\*Caso de Teste ID:\*\* CT06

\- \*\*Requisito Funcional:\*\* RF06.1

\- \*\*Descrição:\*\* Verificar se a API retorna os discos cadastrados no sistema.

\- \*\*Pré-condições:\*\* A API deve estar em execução. Recomenda-se que exista ao menos um disco cadastrado.

\- \*\*Passos:\*\*

&nbsp; 1. Criar uma requisição GET para `http://localhost:3000/discos`.

&nbsp; 2. Enviar a requisição.

&nbsp; 3. Verificar os dados retornados.

\- \*\*Resultado Esperado:\*\* A API deve retornar uma lista de discos cadastrados, incluindo os respectivos dados.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT07 — Buscar discos por título, artista ou gênero



\- \*\*Caso de Teste ID:\*\* CT07

\- \*\*Requisito Funcional:\*\* RF06.2

\- \*\*Descrição:\*\* Verificar se a busca permite localizar discos por texto.

\- \*\*Pré-condições:\*\* Deve existir pelo menos um disco cujo título, artista ou gênero corresponda ao termo pesquisado.

\- \*\*Passos:\*\*

&nbsp; 1. Criar uma requisição GET para `http://localhost:3000/discos?busca=beatles`.

&nbsp; 2. Enviar a requisição.

&nbsp; 3. Verificar se os resultados correspondem à pesquisa.

\- \*\*Resultado Esperado:\*\* A API deve retornar os discos que correspondam ao termo informado nos campos pesquisáveis.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT08 — Cadastrar um novo disco



\- \*\*Caso de Teste ID:\*\* CT08

\- \*\*Requisito Funcional:\*\* RF06.3

\- \*\*Descrição:\*\* Verificar se o sistema permite cadastrar discos com seus dados e informações de estoque.

\- \*\*Pré-condições:\*\* A API e o banco de dados devem estar disponíveis.

\- \*\*Passos:\*\*

&nbsp; 1. Criar uma requisição POST para `http://localhost:3000/discos`.

&nbsp; 2. Enviar um JSON com título, artista, gênero, preço de custo, preço de venda, quantidade em estoque e estoque mínimo.

&nbsp; 3. Verificar a resposta da API.

&nbsp; 4. Consultar a listagem de discos para confirmar o cadastro.

\- \*\*Resultado Esperado:\*\* A API deve retornar o status HTTP 201 e os dados do disco cadastrado.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT09 — Consultar os dados de um disco específico



\- \*\*Caso de Teste ID:\*\* CT09

\- \*\*Requisito Funcional:\*\* RF06.4

\- \*\*Descrição:\*\* Verificar se é possível consultar um disco pelo seu identificador.

\- \*\*Pré-condições:\*\* Deve existir um disco cadastrado com o ID informado.

\- \*\*Passos:\*\*

&nbsp; 1. Criar uma requisição GET para `http://localhost:3000/discos/1`.

&nbsp; 2. Enviar a requisição.

&nbsp; 3. Verificar os dados retornados.

\- \*\*Resultado Esperado:\*\* A API deve retornar os dados do disco correspondente ao ID informado. O número utilizado deve existir no banco de dados.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT10 — Atualizar os dados de um disco



\- \*\*Caso de Teste ID:\*\* CT10

\- \*\*Requisito Funcional:\*\* RF06.5

\- \*\*Descrição:\*\* Verificar se o sistema permite editar os dados de um disco existente.

\- \*\*Pré-condições:\*\* Deve existir um disco cadastrado.

\- \*\*Passos:\*\*

&nbsp; 1. Criar uma requisição PUT para `http://localhost:3000/discos/1`.

&nbsp; 2. Enviar os dados atualizados no formato JSON.

&nbsp; 3. Verificar a resposta da API.

&nbsp; 4. Consultar novamente o disco para confirmar as alterações.

\- \*\*Resultado Esperado:\*\* A API deve atualizar os dados do disco e retornar os dados atualizados.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT11 — Excluir um disco



\- \*\*Caso de Teste ID:\*\* CT11

\- \*\*Requisito Funcional:\*\* RF06.6

\- \*\*Descrição:\*\* Verificar se é possível excluir um disco que não possua movimentações associadas.

\- \*\*Pré-condições:\*\* Deve existir um disco de teste sem movimentações vinculadas.

\- \*\*Passos:\*\*

&nbsp; 1. Criar uma requisição DELETE para `http://localhost:3000/discos/1`.

&nbsp; 2. Enviar a requisição.

&nbsp; 3. Consultar novamente o disco excluído.

\- \*\*Resultado Esperado:\*\* A API deve retornar o status HTTP 204 e o disco não deve mais estar disponível para consulta.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT12 — Registrar uma entrada de estoque



\- \*\*Caso de Teste ID:\*\* CT12

\- \*\*Requisito Funcional:\*\* RF07.1

\- \*\*Descrição:\*\* Verificar se uma movimentação do tipo entrada aumenta a quantidade disponível de um disco.

\- \*\*Pré-condições:\*\* Deve existir um disco e um usuário cadastrados. O ID do disco e o ID do usuário devem ser válidos.

\- \*\*Passos:\*\*

&nbsp; 1. Consultar os discos cadastrados e identificar um ID válido.

&nbsp; 2. Criar uma requisição POST para `http://localhost:3000/movimentacoes`.

&nbsp; 3. Informar o disco, o usuário, o tipo entrada, a quantidade, a data e uma observação opcional.

&nbsp; 4. Enviar a requisição.

&nbsp; 5. Consultar o estoque do disco.

\- \*\*Resultado Esperado:\*\* A API deve registrar a movimentação e aumentar o estoque pela quantidade informada.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT13 — Registrar uma saída de estoque



\- \*\*Caso de Teste ID:\*\* CT13

\- \*\*Requisito Funcional:\*\* RF07.2

\- \*\*Descrição:\*\* Verificar se uma movimentação do tipo saída reduz a quantidade disponível de um disco.

\- \*\*Pré-condições:\*\* Deve existir um disco com estoque suficiente e um usuário cadastrado.

\- \*\*Passos:\*\*

&nbsp; 1. Consultar o estoque atual de um disco.

&nbsp; 2. Criar uma requisição POST para `http://localhost:3000/movimentacoes`.

&nbsp; 3. Informar os IDs válidos, o tipo saída, a quantidade e a data.

&nbsp; 4. Enviar a requisição.

&nbsp; 5. Consultar novamente o estoque do disco.

\- \*\*Resultado Esperado:\*\* A API deve registrar a movimentação e reduzir o estoque de acordo com a quantidade informada.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT14 — Impedir saída maior que o estoque disponível



\- \*\*Caso de Teste ID:\*\* CT14

\- \*\*Requisito Funcional:\*\* RF07.2

\- \*\*Descrição:\*\* Verificar se o sistema impede uma saída com quantidade superior ao estoque disponível.

\- \*\*Pré-condições:\*\* Deve existir um disco com estoque conhecido e um usuário válido.

\- \*\*Passos:\*\*

&nbsp; 1. Consultar a quantidade disponível do disco.

&nbsp; 2. Enviar uma movimentação de saída com quantidade superior à disponível.

&nbsp; 3. Verificar a resposta da API.

&nbsp; 4. Consultar novamente o estoque.

\- \*\*Resultado Esperado:\*\* A API deve rejeitar a operação, informar que o estoque é insuficiente e manter a quantidade original.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT15 — Verificar alerta de estoque mínimo



\- \*\*Caso de Teste ID:\*\* CT15

\- \*\*Requisito Funcional:\*\* RF07.3

\- \*\*Descrição:\*\* Verificar se o sistema apresenta um alerta quando uma saída deixa o estoque abaixo do mínimo definido.

\- \*\*Pré-condições:\*\* Deve existir um disco com estoque mínimo configurado e quantidade suficiente para realizar a saída de teste.

\- \*\*Passos:\*\*

&nbsp; 1. Consultar o estoque atual e o estoque mínimo do disco.

&nbsp; 2. Registrar uma saída que deixe o estoque abaixo do mínimo.

&nbsp; 3. Verificar a resposta da API.

\- \*\*Resultado Esperado:\*\* A resposta deve informar o estoque atualizado e apresentar o alerta de estoque abaixo do mínimo, conforme a regra implementada.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT16 — Listar o histórico de movimentações



\- \*\*Caso de Teste ID:\*\* CT16

\- \*\*Requisito Funcional:\*\* RF07.4

\- \*\*Descrição:\*\* Verificar se o sistema apresenta o histórico de movimentações registradas.

\- \*\*Pré-condições:\*\* A API deve estar em execução. Recomenda-se que exista pelo menos uma movimentação registrada.

\- \*\*Passos:\*\*

&nbsp; 1. Criar uma requisição GET para `http://localhost:3000/movimentacoes`.

&nbsp; 2. Enviar a requisição.

&nbsp; 3. Verificar os dados retornados, incluindo informações do disco e do usuário quando disponíveis.

\- \*\*Resultado Esperado:\*\* A API deve retornar a lista de movimentações ordenada pela data, da mais recente para a mais antiga, conforme a implementação.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT17 — Validar campos obrigatórios no cadastro de disco



\- \*\*Caso de Teste ID:\*\* CT17

\- \*\*Requisito Funcional:\*\* RF06.3

\- \*\*Descrição:\*\* Verificar se o sistema rejeita o cadastro de discos com dados obrigatórios ausentes ou valores inválidos.

\- \*\*Pré-condições:\*\* A API deve estar em execução.

\- \*\*Passos:\*\*

&nbsp; 1. Enviar uma requisição POST para `http://localhost:3000/discos` sem preencher um dos campos obrigatórios.

&nbsp; 2. Repetir o teste com um preço negativo ou uma quantidade inválida.

&nbsp; 3. Verificar as respostas recebidas.

\- \*\*Resultado Esperado:\*\* A API deve retornar um erro de validação, com status HTTP 400 e uma mensagem explicativa, sem cadastrar dados inválidos.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



\### CT18 — Validar campos obrigatórios de movimentação



\- \*\*Caso de Teste ID:\*\* CT18

\- \*\*Requisito Funcional:\*\* RF07.1

\- \*\*Descrição:\*\* Verificar se o sistema rejeita movimentações com dados obrigatórios ausentes ou inválidos.

\- \*\*Pré-condições:\*\* A API deve estar em execução.

\- \*\*Passos:\*\*

&nbsp; 1. Enviar uma requisição POST para `http://localhost:3000/movimentacoes` sem informar todos os campos obrigatórios.

&nbsp; 2. Repetir o teste com uma quantidade igual a zero ou negativa.

&nbsp; 3. Verificar as respostas da API.

\- \*\*Resultado Esperado:\*\* A API deve rejeitar os dados inválidos e retornar mensagens de validação adequadas.

\- \*\*Resultado Obtido:\*\* Preencher após a execução do teste.

\- \*\*Status:\*\* Aprovado / Reprovado.



---



\## 8.2. Ferramentas e Ambientes de Teste



\### Ferramentas utilizadas



| Ferramenta | Finalidade |

|---|---|

| Insomnia | Executar requisições HTTP para testar os endpoints da API, validar códigos de resposta e analisar os dados retornados em JSON. |

| Google Chrome | Acessar a aplicação pelo navegador e verificar seu funcionamento no ambiente local. |

| Node.js | Executar o servidor da API desenvolvido em JavaScript. |

| Express.js | Disponibilizar as rotas e os endpoints da aplicação. |

| Prisma ORM | Realizar as operações de acesso ao banco de dados. |

| MySQL | Armazenar os dados de usuários, discos e movimentações. |

| XAMPP / phpMyAdmin | Disponibilizar o ambiente local de banco de dados e permitir a consulta das tabelas e dos registros. |

| Visual Studio Code | Editar os arquivos do projeto, consultar o código-fonte e acompanhar a execução da aplicação. |



\### Ambiente de teste



Os testes são realizados em ambiente de desenvolvimento local, utilizando um computador com sistema operacional Windows.



A API é executada por meio do Node.js, com o framework Express.js, e disponibiliza seus endpoints localmente. O banco de dados MySQL é utilizado para persistir os dados da aplicação, com gerenciamento por meio do XAMPP e do phpMyAdmin.



O Insomnia é utilizado para testar as operações de cadastro, consulta, atualização, exclusão, autenticação e movimentação de estoque. O navegador Google Chrome é utilizado para acessar a aplicação web pelo endereço local configurado.



\*\*Configuração do ambiente:\*\*



\- \*\*Sistema operacional:\*\* Windows.

\- \*\*Ambiente de execução:\*\* Node.js.

\- \*\*Backend:\*\* JavaScript com Express.js.

\- \*\*ORM:\*\* Prisma.

\- \*\*Banco de dados:\*\* MySQL.

\- \*\*Gerenciamento do banco:\*\* XAMPP e phpMyAdmin.

\- \*\*Ferramenta de teste da API:\*\* Insomnia.

\- \*\*Navegador:\*\* Google Chrome.

\- \*\*Endereço local da API:\*\* `http://localhost:3000`.

\- \*\*Formato de dados das requisições:\*\* JSON.



\### Estratégia de teste



Foi adotada a abordagem de testes manuais, com execução de requisições HTTP e análise das respostas retornadas pela API. Também é realizada a verificação do comportamento da aplicação pelo navegador e a consulta ao banco de dados para confirmar a persistência das informações.



Os testes contemplam cenários positivos, nos quais as operações devem ser realizadas com sucesso, e cenários negativos, nos quais o sistema deve rejeitar dados inválidos, credenciais incorretas, cadastros duplicados ou movimentações incompatíveis com o estoque disponível.



Os resultados devem ser registrados após a execução de cada caso de teste, identificando se o comportamento observado corresponde ao resultado esperado.



\### Considerações finais



Os casos de teste descritos neste documento abrangem as principais funcionalidades do Vinyl Control, incluindo autenticação, cadastro de usuários, gerenciamento de discos e controle de movimentações de estoque.



A execução desses testes contribui para verificar a integridade dos dados, a validação das entradas e o funcionamento das regras de negócio da aplicação. Eventuais falhas identificadas devem ser registradas e corrigidas antes da entrega final do projeto.



