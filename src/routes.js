import {h} from 'hyperapp';
import {Link} from '@hyperapp/router';

import Nav from './views/Nav';

export function view() {
	return function () {
		return <Nav />;
	};
}

