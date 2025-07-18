import { deLocalizeUrl } from './paraglide/runtime.js';

export const reroute = (request) => deLocalizeUrl(request.url).pathname;
