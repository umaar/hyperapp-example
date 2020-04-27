import {app} from 'hyperapp';
import {location} from '@hyperapp/router';

import {initialiseState} from './state/state';
import {actions} from './actions/actions';
import {view} from './routes';

function init() {
	const state = initialiseState();
	const appRootElement = document.querySelector('.app-root');
	const main = app(state, actions, view, appRootElement);
	location.subscribe(main.location);
}

init();
