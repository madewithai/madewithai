import { Octokit } from '@octokit/rest';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const octokit = new Octokit({
    auth: config.public.githubToken,
  });

  try {
    const members = await octokit.paginate(octokit.orgs.listMembers, {
      org: config.public.githubOrg,
      per_page: 100,
    });

    return members;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return { error: message };
  }
});
