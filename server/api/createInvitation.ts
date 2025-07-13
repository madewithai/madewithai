import { Octokit } from '@octokit/rest';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const octokit = new Octokit({
    auth: config.public.githubToken,
  });

  try {
    const body = await readBody(event);
    if (!body.username) {
      return { success: false, error: 'Missing username' };
    }

    const { data: user } = await octokit.users.getByUsername({ username: body.username });

    const { data } = await octokit.orgs.createInvitation({
      org: config.public.githubOrg,
      invitee_id: user.id,
    });

    return { success: true, invited_at: data.created_at };

  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return { success: false, error: message };
  }
});
