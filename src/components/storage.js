class Storage {
	static get key() {
		return 'DEV_PORTAL';
	}

	set(value) {
		localStorage.setItem(Storage.key, value);
	}

	remove() {
		localStorage.removeItem(Storage.key);
	}

	get() {
		return localStorage.getItem(Storage.key);
	}
}

export default new Storage();
