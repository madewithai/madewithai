import { Octokit } from '@octokit/rest';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig(event);
  const token = config.public.githubToken;
  const octokit = new Octokit({
    auth: token,
  });
  return octokit.orgs
    .listMembers({
      org: config.public.githubOrg,
    })
    .then(response => {
      return response.data;
    });
});
