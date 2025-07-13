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
      return { error: 'Missing username' };
    }

    const { data } = await octokit.users.getByUsername({ username: body.username });
    return {
      avatar: data.avatar_url,
      id: data.id,
    };

  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return { error: message };
  }
});
