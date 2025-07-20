import { server } from './mocks/server.js';

server.listen({ onUnhandledRequest: 'bypass' });
