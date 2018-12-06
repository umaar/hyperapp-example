import {location} from '@hyperapp/router';
import auth from '../components/auth';
import http from '../components/http';

export const actions = {
	location: location.actions,
	setSuccessfulLoginStatus(user) {
		return function () {
			return {
				auth: user,
				submitButtonEnabled: true
			};
		};
	},

	setUnsuccessfulLoginStatus({message}) {
		return function () {
			return {
				auth: false,
				loginErrorMessage: message,
				submitButtonEnabled: true
			};
		};
	},

	setPendingLoginStatus() {
		return function () {
			return {
				submitButtonEnabled: false
			};
		};
	},

	login() {
		return async function ({email, password}, actions) {
			actions.setPendingLoginStatus();
			try {
				await auth.login(email, password);
				const user = auth.getUser();
				location.actions.go('/apps');
				actions.setSuccessfulLoginStatus(user);
			} catch (err) {
				console.error('Error logging in', err);
				actions.setUnsuccessfulLoginStatus(err);
			}
		};
	},

	logout() {
		auth.logout();
		location.actions.go('/login');
		return {
			auth: false
		};
	},

	updateApp({id: targetID, name}) {
		return function (state) {
			if (!targetID) {
				return;
			}

			const app = state.apps.find(({id}) => id === targetID);

			// TODO: Need to update the state
			http.fetch({
				path: `/apps/${app.id}`,
				method: 'PUT',
				body: JSON.stringify({name})
			});
		};
	},

	handleEmailUpdate(email) {
		return function () {
			return {
				email
			};
		};
	},

	handlePasswordUpdate(password) {
		return function () {
			return {
				password
			};
		};
	},

	updateAppsList(apps) {
		return function () {
			return {
				apps
			};
		};
	},

	getApps() {
		return async function (state, actions) {
			try {
				const {apps} = await http.fetch({
					path: '/apps'
				});
				actions.updateAppsList(apps);
			} catch (err) {
				console.error('Error getting apps', err);
			}
		};
	},

	updateusersList({users, id: targetID}) {
		return function (state) {
			return {
				apps: state.apps.map(app => {
					if (app.id === targetID) {
						return Object.assign({}, app, {
							users
						});
					}
					return app;
				})
			};
		};
	},

	getUsers({id}) {
		return async function (state, actions) {
			try {
				let allUsers = [];
				let offset = 0;

				// TODO: Turn this into a recursive function
				// TODO: Load subsequent pages on demand
				while (true) {
					const path = `/apps/${id}/users?offset=${offset}`;

					const {users} = await http.fetch({
						path
					});

					if (!users || !users.length) {
						break;
					}

					allUsers = allUsers.concat(users);
					offset += 25;
				}

				actions.updateusersList({
					users: allUsers,
					id
				});
			} catch (err) {
				console.error('Error getting users', err);
			}
		};
	}
};
