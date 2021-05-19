import { Api, ProjectSchema } from './types';

export async function getBotTsFileFromProject(api: Api, project: ProjectSchema) {
  const botTsFile = await api.RepositoryFiles.showRaw(project.id, 'renovate.json', 'master');
  console.log(project.name, botTsFile);
}
