import { Octokit } from '@octokit/rest';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const octokit = new Octokit({
    auth: config.public.githubToken,
  });

  return octokit.orgs
    .listMembers({
      org: config.public.githubOrg,
      per_page: 100,
    })
    .then(response => {
      return response.data;
    });
});
