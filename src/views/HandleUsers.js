import {h, app} from 'hyperapp';
import {Link} from '@hyperapp/router';

function UsersList({users}) {
	return function () {
		return <ol>
			{users && users.map(({email, name}) => (
				<li>
					<p>
						{name} ({email})
					</p>
				</li>
			))}
		</ol>;
	};
}

export default function HandleUsers({shouldShowUsers, id, users}) {
	return function (state, actions) {
		if (shouldShowUsers) {
			return <div oncreate={() => actions.getUsers({id})}>
				<p>
					Showing <strong>{users && users.length}</strong> users
				</p>

				<UsersList users={users} />
			</div>;
		}

		return <div> <span class="emoji">👥</span>
			<Link to={`/apps/${id}`}>
				View Users
			</Link>
		</div>;
	};
}
