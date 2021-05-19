import dotenv from 'dotenv';

import Api from './api';
import Plugins from './plugins';

dotenv.config();

const { GITLAB_URL, GITLAB_TOKEN, ENABLED_PROJECTS } = process.env;

const api = Api(GITLAB_URL, GITLAB_TOKEN);

async function loop() {
  const projects = await api.Projects.all();

  const enabledProjects = projects.filter((p) => ENABLED_PROJECTS.split(',').includes(`${p.namespace.path}/${p.path}`));

  for (const project of enabledProjects) {
    console.log(':::', project.name, '-', 'running ...');

    for (const plugin of Plugins) {
      try {
        await plugin({ api, project });
      } catch (error) {
        console.error(':::', project.name, 'Error', error);
      }
    }
  }
}

function start() {
  console.log(`Lassie is waking up "${GITLAB_URL}" ...`);

  setInterval(() => {
    loop();
  }, 1000 * 30);

  loop();

  console.log('Lassie is now watching for jobs!');
}

start();
