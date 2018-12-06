import {h, app} from 'hyperapp';
import {Redirect} from '@hyperapp/router';
import auth from '../components/auth';

function onSubmit(actions) {
	return function(evt) {
		evt.preventDefault();
		actions.login();
	}
}

function onEmailInput(actions) {
	return function(evt) {
		actions.handleEmailUpdate(evt.target.value)
	}
}

function onPasswordInput(actions) {
	return function(evt) {
		actions.handlePasswordUpdate(evt.target.value)
	}
}

export default function Login() {
	return function (state, actions) {
		if (auth.getUser()) {
			return <Redirect to={'/apps'} />;
		}

		return <div>
			<h2>Login</h2>

			{state.loginErrorMessage && <p>{state.loginErrorMessage}</p>}

			<form class="login" onsubmit={onSubmit(actions)}>
				<div class="login-group">
					<label for="email">
						Email
					</label>

					<input
						id="email"
						name="email"
						oninput={onEmailInput(actions)}
						type="text"
					/>
				</div>


				<div class="login-group">
					<label for="password">
						Password
					</label>

					<input
						name="password"
						id="password"
						oninput={onPasswordInput(actions)}
						type="password"
					/>
				</div>

				<div class="login-group">
					<input type="submit" disabled={!state.submitButtonEnabled} />
				</div>
			</form>
		</div>;
	};
};