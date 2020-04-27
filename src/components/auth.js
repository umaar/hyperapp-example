import JWTDecode from 'jwt-decode';
import storage from './storage';
import http from './http';

class Auth {
	constructor() {
		this.storage = storage;
	}

	async login(email, password) {
		const {accessToken} = await http.fetch({
			path: '/login',
			method: 'POST',
			body: JSON.stringify({
				email,
				password
			})
		});

		if (accessToken) {
			this.storage.set(accessToken);
			return true;
		}

		throw new Error('Could not access your account');
	}

	logout() {
		this.storage.remove();
	}

	getUser() {
		const accessToken = this.storage.get();

		if (!accessToken) {
			this.logout();
			return false;
		}

		const {exp: expiry, email} = JWTDecode(accessToken);
		const expiryDate = new Date(expiry * 1000);

		if ((new Date() > expiryDate) || !email) {
			this.logout();
			return false;
		}

		return email;
	}
}

export default new Auth();
