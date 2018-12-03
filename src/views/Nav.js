import {h} from 'hyperapp';
import {Link, Route} from '@hyperapp/router';
import Home from './Home';
import Apps from './Apps';
import Login from './Login';
import AppItemContainer from './AppItemContainer';

function LoginOrLogout() {
	return function ({auth}, {logout}) {
		if (auth) {
			return <div>
				<p>{auth}
					<small>
						<button onclick={logout}>(Sign out)</button>
					</small>
				</p>
			</div>
		}
		return <p>
			<Link to="/login">Login</Link>
		</p>;
	};
}

export default function Nav() {
	return function() {
		return <div>
			<ul class="nav">
				<li>
					<p>
						🏠️  <Link to="/">Home</Link>
					</p>
				</li>
				<li>
					<LoginOrLogout />
				</li>
			</ul>

			<Route path="/" render={Home} />
			<Route path="/login" render={Login} />
			<Route path="/apps" render={Apps} />
			<Route path={'/apps/:appId'} render={AppItemContainer} />
		</div>
	}
}