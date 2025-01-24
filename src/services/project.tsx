/* eslint-disable import/no-mutable-exports */
import type { DocumentContext } from 'next/dist/shared/lib/utils';
import { publishDbgObject } from '../utils';
import { isBrowser } from '../components/helpers';
import type { TranslationId } from './types';
import { IncomingMessage } from 'node:http';

type Project = {
  id: string;
  name: string;
  url: string;
  ogImage: string;
  description: TranslationId;
  serpDescription: TranslationId;
};

const osmapp: Project = {
  id: 'osmapp',
  name: 'OsmAPP',
  url: 'https://osmapp.org',
  ogImage: 'https://osmapp.org/screens/karlstejn2.png',
  description: 'project.osmapp.description',
  serpDescription: 'project.osmapp.serpDescription',
};

const osmappDev: Project = {
  ...osmapp,
  name: 'OsmAPP-DEV',
};

const openclimbing: Project = {
  id: 'openclimbing',
  name: 'openclimbing.org',
  url: 'https://openclimbing.org',
  ogImage: 'https://osmapp.org/screens/karlstejn2.png', // TODO
  description: 'project.openclimbing.description',
  serpDescription: 'project.openclimbing.serpDescription',
};

const domains: Record<string, Project> = {
  'osmapp.org': osmapp,
  'openclimbing.org': openclimbing,
  '127.0.0.1:3000': openclimbing,
};
const prUrl = (host: string) =>
  /^osmapp-git(.*)climbing(.*)vercel.app$/.test(host) ? openclimbing : null;

// Globals
export let PROJECT_ID = 'error: PROJECT not set';
export let PROJECT_NAME = 'error: PROJECT not set';
export let PROJECT_URL = 'error: PROJECT not set';
export let PROJECT_OG_IMAGE = 'error: PROJECT not set';
export let PROJECT_DECRIPTION = 'error: PROJECT not set' as TranslationId;
export let PROJECT_SERP_DESCRIPTION = 'error: PROJECT not set' as TranslationId;

const setProject = (host: string) => {
  const project = domains[host] ?? prUrl(host) ?? osmappDev;
  PROJECT_ID = project.id;
  PROJECT_NAME = project.name;
  PROJECT_URL = project.url;
  PROJECT_OG_IMAGE = project.ogImage;
  PROJECT_DECRIPTION = project.description;
  PROJECT_SERP_DESCRIPTION = project.serpDescription;

  publishDbgObject('project', project);
};

// server - runs in document getInitialProps()
export const setProjectForSSR = (req: IncomingMessage) => {
  const { host } = req.headers;
  setProject(host);
};

// browser - runs here
if (isBrowser()) {
  const { host } = window.location;
  setProject(host);
}
