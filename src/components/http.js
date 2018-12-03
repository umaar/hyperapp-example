import storage from './storage';

const url = 'http://localhost:3000';

const http = {
	async fetch({path, method = 'GET', body}) {
		const headers = new Headers({
			'Content-Type': 'application/json'
		});

		const token = storage.get();

		if (token) {
			headers.set('authorization', token);
		}

		try {
			const response = await fetch(url + path, {
				body,
				method,
				headers
			});

			const statusCode = response.status;

			if (statusCode >= 200 && statusCode < 300) {
				return response.json();
			}
			throw new Error(`${response.statusText} (${statusCode})`);
		} catch (err) {
			throw new Error(err);
		}
	}
};

export default http;
