const	http = require('http'),
		io = require('socket.io')
		mysql = require('mysql'),
		querystring = require('querystring'),
		server = new http.Server(),
		url = require('url');

let pairs = [];//Валютные пары

	//Проверяем есть ли пара
let checkPair = pair => pairs.filter(item => item.name == pair).length;

//Подключаемся к БД
let con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'trade'
});

con.query("SELECT * FROM  `pairs` LIMIT 0 , 30", (err, result) => pairs = result);

server.on('request', (req, res) => {
	let request = '',
		insertRate = (pair, rate, percent) => con.query(
				"INSERT INTO rates SET ?",
				{
					id: 'NULL',
					pair: pair,
					rate: rate,
					percent: percent,
					date: new Date()
				},
				(err, result) => {
					if (err)
						console.log(
							'Error--->\n' +
							'\ttime: ' + new Date() + '\n' +
							'\toperation: "INSERT INTO rates SET"' + '\n' +
							'\tpair: ' + pair +
							'\trate: ' + rate +
							'\terror: ' + err + '\n' +
							'<---Error'
						);
					else
						console.log({
							id: result.insertId,
							serverStatus: result.serverStatus,
							pair: pair,
							rate: rate
						});
				}
			);

	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');

	req.on('data', chunk => {
		request += chunk;

		if (!checkPair(JSON.parse(request).pair)) {
			con.query(
				"INSERT INTO pairs SET ?",
				{
					id: 'NULL',
					name: JSON.parse(request).pair
				},
				(err, result) => {
					if (err)
						console.log(
							'Error--->\n' +
							'\ttime: ' + new Date() + '\n' +
							'\toperation: "INSERT INTO pairs"' + '\n' +
							'\tpair: ' + JSON.parse(request).pair +
							'\terror: ' + err + '\n' +
							'<---Error'
						);

					con.query("SELECT * FROM  `pairs` LIMIT 0 , 30", (err, result) => pairs = result);
					insertRate(result.insertId, JSON.parse(request).rate, JSON.parse(request).percent);
				}
			);
		}
		else {
			con.query(
				"SELECT * FROM pairs WHERE name=?",
				JSON.parse(request).pair,
				(err, result) => {
					if (err)
						console.log(
							'Error--->\n' +
							'\ttime: ' + new Date() + '\n' +
							'\toperation: "SELECT * FROM pairs WHERE name="' + '\n' +
							'\tpair: ' + JSON.parse(request).pair +
							'\terror: ' + err + '\n' +
							'<---Error'
						);

					if (result.length)
						insertRate(+result[0].id, JSON.parse(request).rate, JSON.parse(request).percent);
				}
			);
		}
	});

	res.end();
});

server.listen(1337, '127.0.0.1');

let Io = io.listen(server);

Io.sockets.on('connection', socket => {
	console.log('on connect');

	// socket.on('ddd', data => console.log(data));

	let index = 1;

	setInterval(() => socket.emit('ddd', ('ttt' + index++)), 1000);	
})