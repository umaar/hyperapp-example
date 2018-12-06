import {Redirect} from '@hyperapp/router';
import {h, app} from 'hyperapp';
import auth from '../components/auth';
import AppItem from './AppItem';

function AppsList({apps}) {
	return function() {
		return <ul class="apps-list">
			{apps.map(({id, name, created, logo}) => (
				<li>
					<AppItem id={id} name={name} created={created} logo={logo} />
				</li>
			))}
		</ul>
	}
}

export default function Apps() {
	return function (state, actions) {
		if (auth.getUser()) {
			return <div>
				<div oncreate={actions.getApps}>
					<p>
						Displaying <strong>{state.apps.length}</strong> apps
					</p>

					<AppsList apps={state.apps} />
				</div>
			</div>
		}

		return <Redirect to={'/login'} />
	};
}

