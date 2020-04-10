import * as http from 'http';
import { Collection } from './collection.js';

const collection = new Collection('/homeworks');

function createTable(users) {
  
  const gridHeight = Number(users.length);

  let result = '';
  result = result + '<html><table border="1">';
  
  for (let i = 0; i < gridHeight; i++) {
    result = result + '<tr>';
    result = result + `<td>${users[i].number}</td>`;
    result = result + `<td><a href="/homeworks/${users[i].id}">${users[i].title}</a></td>`;
    result = result + `<td>
      <script>
        function deleteHW(id) {
          const xhr = new XMLHttpRequest();
          xhr.open('DELETE', '/homeworks/'+id, true);
          xhr.send(id);
          setTimeout(() => location.reload(true), 200);
        }
      </script>
      <button type="button" onclick="deleteHW('${users[i].id}')">X</button>
      </td>`;
    result = result + '</tr>';
  }

  result = result + '</table></html>';
  return result;
}

/**
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 */
async function requestHandler(request, response) {
  if (request.url === '/') {
    response.writeHead(200);
    response.write('<a href="/homeworks">To Table</a>');
    response.end();
  }

  if (request.url.startsWith('/homeworks')) {
    if (request.method === 'GET' && (request.url === '/homeworks')) {
      const list = await collection.list();
      response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8;'});
      response.write(createTable(list), 'utf8');
      response.end();
      return;
    }

    if (request.method === 'GET' && request.url.startsWith('/homeworks/')) {
      const id = request.url.slice(11);
      const hw = await collection.findOne(id);
      response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8;'});
      response.write(JSON.stringify(hw, null, 4), 'utf8');
      response.end();
      return;
    }

    if (request.method === 'DELETE' && request.url.startsWith('/homeworks/')) {
      const id = request.url.slice(11);
      await collection.delete(id);
      response.writeHead(200);
      response.end();
      return;
    }
  }
}

const server = http.createServer(requestHandler);
const PORT = 5000;

server.on('listening', () => console.log(`Listening on port: ${PORT}`));

server.listen(process.env.PORT || PORT);