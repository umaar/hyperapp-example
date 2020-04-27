const express = require('express');
const database = require('./database.js');
const app = express();
const jwt = require('jsonwebtoken');
app.use(require('body-parser').json());
app.use(require('morgan')('combined'));
app.set('json spaces', 4);

const jwtSecret = 'mondo is the best';

app.use((request, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	if (request.method == 'OPTIONS') {
		res.send(200);
	} else {
		next();
	}
});

app.get('/robots.txt', (request, res) => {
	res.send('User-agent: *\nDisallow: /');
});

app.get('/ping', (request, res) => {
	res.send('Hullo');
});

// POST /login with JSON-encoded body {"email": "...", "password": "..."}
//  - returns 401 and JSON-encoded error if the password isn't hunter2
//  - returns 200 and {"token": "..."} otherwise. This token can be used in subsequent requests
//    in the Authorization header to authenticate
app.post('/login', (request, res, next) => {
	if (request.body.password != 'hunter2') {
		return res.status(401).json({
			error: 'Cannot log in with the given email and password.'
		});
	}

	// Init a database for this user if there isn't one already
	database.initUser(request.body.email);

	res.json({
		accessToken: jwt.sign({
			email: request.body.email
		}, jwtSecret, {
			expiresIn: request.body.expiry || '30m'
		})
	});
});

app.get('/dump', (request, res, next) => {
	res.json(database.dump());
});

// "Authentication" middleware
//   - Access tokens need to be passed in HTTP Authorization header as they were received from /login
const decodeToken = function (tokenString) {
	try {
		return jwt.verify(tokenString, jwtSecret);
	} catch (error) {
		return null;
	}
};

app.use((request, res, next) => {
	request.token = decodeToken(request.headers.authorization);
	if (!request.token) {
		return res.status(401).json({error: 'Access token invalid or couldn\'t be parsed. Please log in using /login.'});
	}

	next();
});

app.get('/apps', (request, res) => {
	res.json({
		apps: database.getApps(request.token.email)
	});
});

app.get('/apps/:appId/users', (request, res) => {
	const limit = Math.min(Number.parseInt(request.query.limit) || 25, 25);
	const offset = Number.parseInt(request.query.offset) || 0;
	res.json({
		users: database.getUsers(request.token.email, request.params.appId).slice(offset, offset + limit)
	});
});

app.put('/apps/:appId', (request, res) => {
	res.json({
		app: database.updateApp(request.token.email, request.params.appId, request.body)
	});
});

app.get('/', (request, res) => {
	res.json({
		message: 'The API is alive and your access token is valid :)',
		token: request.token
	});
});

// We clean up data that hasn't been accessed in the last hour every minute or so to prevent
// applicants from (accidentally) nuking our dyno
setInterval(() => {
	database.reap(new Date(Date.now() - 60 * 60 * 1000));
}, 60 * 1000);

app.listen(process.env.PORT || 3000, () => {
	console.log('Example app listening on port 3000!');
});
