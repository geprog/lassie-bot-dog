import { Approval } from '../types';
import { definePlugin } from './index';

export default definePlugin(async ({ api, project }) => {
  let mrs = await api.MergeRequests.all({ projectId: project.id, labels: ['👀 Ready for Review'], state: 'opened' });

  if (!Array.isArray(mrs)) {
    mrs = [mrs];
  }

  for (const mr of mrs) {
    const mrIid = mr.iid as number;
    const pipelines = await api.MergeRequests.pipelines(project.id, mrIid);
    const approvals = (await api.MergeRequestApprovals.approvals(project.id, { mergerequestIid: mrIid })) as Approval;

    const checks = {
      reviewers: (mr.reviewers as string[]).length,
      approvals: approvals.approved_by.length,
      has_conflicts: mr.has_conflicts,
      unresolved_discussions: !mr.blocking_discussions_resolved,
      last_pipeline_status: pipelines[0].status,
    };

    if (
      checks.approvals >= 1 &&
      checks.has_conflicts === false &&
      checks.unresolved_discussions === false &&
      checks.last_pipeline_status === 'success'
    ) {
      console.log('merge', ':::', mr.title);
      await api.MergeRequests.accept(project.id, mrIid, { squash: true });
    }
  }
});
