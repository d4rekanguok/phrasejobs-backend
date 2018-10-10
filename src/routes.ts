import Router from 'koa-router';
const router = new Router();

import client from './config/axios-phraseapp';
import auth from './middleware/auth';

router.post('/authorize', async (ctx) => {
  const { username, password }:any = ctx.request.body;

  const { data } = await client.post('authorizations', {
    note: 'phrasejobs',
    scopes: ['read', 'write']
  }, {
    auth: { username, password }
  });
  console.log(data);
  ctx.body = { token: data.token };
})

router.get('/jobs', auth, async (ctx) => {
  const client = ctx.state.client;

  const allProjects = await client
    .get('projects')
    .then(res => res.data)
    .catch(err => ctx.throw(err))

  // todo: add project name into job detail
  const accountId:string = "7e0b50e0";
  const projects = allProjects.filter(p => p.account.id === accountId);
  const jobArrays = await Promise.all(
    projects.map(
      p => client
        .get(`projects/${p.id}/jobs?state=in_progress`)
        .then(res => res.data)
        // todos: throw different error dependning on the error here
        // or just throw error & handle them in the error middleware
        .catch(err => ctx.throw(408, `Couldn't load jobs, please refresh`))
    )
  );

  ctx.body = jobArrays;
})

export default router;