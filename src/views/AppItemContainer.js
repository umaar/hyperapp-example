import {Redirect} from '@hyperapp/router';
import {h, app} from 'hyperapp';
import auth from '../components/auth';
import AppItem from './AppItem';

export default function AppItemContainer({match}) {
	return function (state, actions) {
		if (auth.getUser()) {
			if (!state.apps.length) {
				actions.getApps();
			}

			const [filteredApp] = state.apps.filter(({id}) => id === match.params.appId);

			if (!filteredApp) {
				return <p>Sorry, that app ID cannot be retrieved</p>;
			}

			const {id, name, created, logo, users} = filteredApp;

			return <div>
				<AppItem
					id={id}
					name={name}
					created={created}
					logo={logo}
					shouldShowUsers={true}
					users={users}
				/>
			</div>
		}

		return <Redirect to={'/login'} />;
	};
}