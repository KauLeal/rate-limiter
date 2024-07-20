
# Rate Limiter

Projeto sobre a implementação de rate limiters para a disciplina de Redes de Computadores.




## Passo a passo

#### Setup:

    1. Iniciar o cmd na pasta principal (shift + botão direito)

    2. Executar: node app.js

    3. Abrir outro cmd como administrador, onde serão realizados os testes

#### Token Bucket

Windows:

    for /L %i in (1,1,15) do curl http://127.0.0.1:8080/bucketLimited
Linux

    for i in {1..15}; do
     echo "Requisição número $i"
     curl http://127.0.0.1:8080/bucketLimited
     echo ""
    done


Resultado esperado: 10 requisições passam e 5 não passam.

#### Fixed Window Counter

Windows

    for /L %i in (1,1,70) do curl http://127.0.0.1:8080/windowLimited
Linux

    for i in {1..70}; do
     echo "Requisição número $i"
     curl http://127.0.0.1:8080/windowLimited
     echo ""
    done

Resultado esperado: 60 requisições passam e 10 não passam.

#### Sliding Window Log

Windows

    for /L %i in (1,1,7) do curl -s -o nul  "%{http_code}\n" http://127.0.0.1:8080/slidingWindowLimited
Linux

    for i in {1..7}; do
     echo "Requisição número $i"
     curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/slidingWindowLimited
    done

Resultado esperado: 5 requisições passam e 2 não passam.

#### Sliding Window Counter

    1. Iniciar uma instância do Redis. Pode iniciar com o docker utilizando o comando:
    sudo docker run --name my-redis -p 6379:6379 -d redis

    2. Executar node server1.js no primeiro PowerShell

    3. Executar node server2.js no segundo PowerShell

    4. Realizar os testes no terceiro PowerShell

#### Teste 1:
Requisições pro server1.js no Windows

    for ($i=1; $i -le 60; $i++) {Invoke-WebRequest -Uri http://localhost:3001 -UseBasicParsing}

Requisições pro server1.js no Linux

    for i in {1..60}; do
     curl -s -o /dev/null -w "Requisição número $i: %{http_code}\n" http://localhost:3001/
done

Requisições pro server2.js no Windows
    
    Invoke-WebRequest -Uri http://localhost:3002/ -UseBasicParsing

Requisições pro server2.js no Linux
    
    curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3002/

Resultado esperado: todas as requisições do server 1 passam, mas a requisição do server 2 não passa.

#### Teste 2:
Requisições pro server2.js no Windows

    for ($i=1; $i -le 60; $i++) {Invoke-WebRequest -Uri http://localhost:3002/ -UseBasicParsing}

Requisições pro server2.js no Linux

    for i in {1..60}; do
     curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3002/
    done

Requisições pro server1.js no Windows
    
    Invoke-WebRequest -Uri http://localhost:3001/ -UseBasicParsing

Requisições pro server1.js no Linux
    
    curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/

Resultado esperado: todas as requisições do server 2 passam, mas a requisição do server 1 não passa.

## Anexos:

Apresentação da Ana Larissa sobre tokenBucket.js:

    https://drive.google.com/file/d/1G--w4F5Xz1Q5L-NxBvtjzSrQ3VuR9Jvs/view?usp=drive_link

## Integrantes

> Os seguintes alunos contribuíram para o projeto:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/lycie03">
        <img src="https://github.com/lycie03.png" width="100px;" alt="Foto de perfil do Ana Larissa no GitHub"/><br>
        <sub>
          <b>Alícia Lima</b>
        </sub>
      </a>
    </td>
     <td align="center">
      <a href="https://github.com/Analarie">
        <img src="https://github.com/Analarie.png" width="100px;" alt="Foto de perfil do Ana Larissa no GitHub"/><br>
        <sub>
          <b>Ana Larissa</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/gabomoreira">
        <img src="https://github.com/gabomoreira.png" width="100px;" alt="Foto de perfil do Gabriel dos Santos Moreira no GitHub"/><br>
        <sub>
          <b>Gabriel dos Santos Moreira</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/KauLeal">
        <img src="https://github.com/KauLeal.png" width="100px;" alt="Foto de perfil do Kaú Leal no GitHub"/><br>
        <sub>
          <b>Kaú Leal</b>
        </sub>
      </a>
    </td>
  </tr>
</table>
