import {app} from 'hyperapp';
import {location} from '@hyperapp/router';

import {initialiseState} from './state/state';
import {actions} from './actions/actions';
import {view} from './routes';

import './styles/app.scss';

function init() {
	const state = initialiseState();
	const appRootEl = document.querySelector('.app-root');
	const main = app(state, actions, view, appRootEl);
	location.subscribe(main.location);
}

init();
