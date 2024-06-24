import { Octokit } from '@octokit/rest';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const octokit = new Octokit({
    auth: config.public.githubToken,
  });

  const body = await readBody(event);

  return octokit.orgs
    .createInvitation({ org: config.public.githubOrg, invitee_id: body.invitee_id })
    .then(({ data }) => {
      return { data };
    })
    .catch(error => {
      return { error: error.response.data.errors[0].message };
    });
});
