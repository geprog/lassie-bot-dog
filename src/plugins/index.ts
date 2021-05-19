import { Gitlab } from '@gitbeaker/node';
import { Api, ProjectSchema } from '../types';
import autoMerge from './auto-merge';

export default [autoMerge];

export type PluginContext = { api: Api; project: ProjectSchema };

type Plugin = (ctx: PluginContext) => Promise<void>;
export function definePlugin(plugin: Plugin): Plugin {
  return plugin;
}
