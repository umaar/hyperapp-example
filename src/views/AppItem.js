// import {Redirect, Link} from '@hyperapp/router';
import { formatDistance } from 'date-fns'
import {h, app} from 'hyperapp';
import HandleUsers from './HandleUsers';

function onBlur({actions, id}) {
	return function(evt) {
		actions.updateApp({id, name: evt.target.textContent.trim()});
	}
}

function onKeyDown({actions, id}) {
	return function(evt) {
		if (evt.key === 'Enter') {
			evt.preventDefault();
			actions.updateApp({id, name: evt.target.textContent.trim()});
		}
	}
}

export default function AppItem({users, id, name, created, logo, shouldShowUsers = false}) {
	return function (state, actions) {
		// Note: Images from lorempixel.com are timing out
		// E.g. `<img alt={name} src={logo} />`

		return <div>
			<div class="app-item-title">
				<span class="emoji">✏️</span> <h4
						onblur={onBlur({actions, id})}
						contenteditable
						onkeydown={onKeyDown({actions, id})}>
						{name}
					</h4>
			</div>

			<p title={new Date(created)}>
				<span class="emoji">🗓️</span> {formatDistance(new Date(created), new Date())} ago
			</p>

			<HandleUsers shouldShowUsers={shouldShowUsers} id={id} users={users} />
		</div>
	};
};