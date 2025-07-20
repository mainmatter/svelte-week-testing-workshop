import { worker } from './mocks/client';

worker.start({
	onUnhandledRequest: 'bypass'
});
