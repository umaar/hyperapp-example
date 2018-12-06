import {Redirect} from '@hyperapp/router';
import {h, app} from 'hyperapp';

export default function Home() {
	return function () {
		return <Redirect to={'/apps'} />
	};
};