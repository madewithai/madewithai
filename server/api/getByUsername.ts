import { Octokit } from '@octokit/rest';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const octokit = new Octokit({
    auth: config.public.githubToken,
  });

  const body = await readBody(event);

  return octokit.users
    .getByUsername({ username: body.username })
    .then(({ data }) => {
      return { avatar: data.avatar_url, id: data.id };
    })
    .catch(error => {
      return { error };
    });
});
