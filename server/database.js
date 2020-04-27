const faker = require('faker');

const dbs = {};

const _getAppsForUser = function (userId) {
	if (!dbs[userId]) {
		return [];
	}

	dbs[userId].accessed = new Date();
	return dbs[userId].Apps;
};

const _getAppForUser = function (userId, appId) {
	return _getAppsForUser(userId).filter(a => {
		return a.id === appId;
	})[0];
};

// Removes the `users` key from a app
const _stripApp = function (a) {
	return {
		id: a.id,
		name: a.name,
		created: a.created,
		logo: a.logo
	};
};

function _random(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

// Ensures that there's data in this user's database
const initUser = function (userId) {
	if (dbs[userId]) {
		return false;
	}

	dbs[userId] = {
		created: new Date(),
		accessed: new Date(),
		Apps: []
	};
	const numberApps = _random(2, 5);
	for (let i = 0; i < numberApps; i++) {
		// Generate some users
		const app = {
			id: faker.random.uuid(),
			name: faker.commerce.productName(),
			logo: faker.image.imageUrl(400, 400, 'animals'),
			created: faker.date.past(),
			users: []
		};
		dbs[userId].Apps.push(app);

		const numberUsers = _random(55, 200);
		for (let j = 0; j < numberUsers; j++) {
			app.users.push({
				id: faker.random.uuid(),
				name: faker.name.findName(),
				email: faker.internet.email(),
				avatar: faker.image.avatar()
			});
		}
	}

	return true;
};

const getApps = function (userId) {
	return _getAppsForUser(userId).map(c => {
		return _stripApp(c);
	});
};

// Returns an array of all users for a given app
const getUsers = function (userId, appId) {
	const app = _getAppForUser(userId, appId);
	if (!app) {
		return [];
	}

	return app.users;
};

// Updates a app
const updateApp = function (userId, appId, updates) {
	const app = _getAppForUser(userId, appId);
	if (!app) {
		return null;
	}

	Object.keys(updates).forEach(key => {
		if (key != 'users' && key != 'created') {
			app[key] = updates[key];
		}
	});
	return _stripApp(app);
};

// Erases all databases that haven't been used after cutoff
const reap = function (cutoff) {
	console.log('Running the reaper!');
	Object.keys(dbs).forEach(userId => {
		if (dbs[userId].accessed < cutoff) {
			console.log('Deleting data for user ' + userId + ' because it hasn\'t been used since ' + dbs[userId].accessed.toString());
			delete dbs[userId];
		}
	});
};

const dump = function () {
	return dbs;
};

module.exports = {
	dump,
	reap,
	getApps,
	initUser,
	getUsers,
	updateApp
};
