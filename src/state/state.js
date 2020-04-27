import {location} from '@hyperapp/router';
import auth from '../components/auth';

export function initialiseState() {
	return {
		location: location.state,
		auth: auth.getUser(),
		email: '',
		password: '',
		loginErrorMessage: '',
		submitButtonEnabled: true,
		apps: [],
		userPageIndex: 0
	};
}
