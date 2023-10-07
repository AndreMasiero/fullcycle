const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'test',
    database: 'nodedb'
};
const mysql = require('mysql')
const connection = mysql.createConnection(config)

const names = [
    "Andre", "Paulo", "Cleide", "David", "Carlos",
    "Francisco", "Graciane", "Helen", "Isac", "Jack",
    "Katie", "Louis", "Mandy", "Nancy", "Oliver",
    "Patricia", "Quinn", "Rachel", "Steve", "Tina"
];

const randomName = names[Math.floor(Math.random() * names.length)];
const randomNumber = Math.floor(Math.random() * 101);
const sqlInsert = `INSERT INTO people(username, cod) VALUES ('${randomName}', ${randomNumber})`;

app.get('/', (req, res) => {
    connection.query(sqlInsert, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database Error', err);
            return;
        }

        connection.query('SELECT * FROM people', (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Database Error');
                return;
            }

            // Construindo uma resposta visual para visualizar os dados
            let htmlResponse = '<h1>Full Cycle</h1>';
            htmlResponse += '<ul>';
            results.forEach(row => {
                htmlResponse += `<li>${row.username} - ${row.cod}</li>`;
            });
            htmlResponse += '</ul>';

            res.send(htmlResponse);
        });
    });
});

app.listen(port, () => {
    console.log('Rodando na porta ', port)
});

process.on('exit', () => {
    connection.end();
});
