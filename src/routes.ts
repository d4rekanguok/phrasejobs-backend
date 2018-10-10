import Router from 'koa-router';
const router = new Router();

import axios from 'axios';
// import qs from 'querystring';

router.post('/api', async (ctx) => {
  const { email, password }:any = ctx.request.body;

  const { data:allProjects } = await axios({
    method: 'get',
    url: 'https://api.phraseapp.com/api/v2/projects',
    headers: {
      'Authorization': `Basic ${Buffer.from(email + ":" + password).toString('base64')}`,
      'User-Agent': 'PhraseJobs (derek@penandpillow.com)',
    }
  })

  // todo: add project name into job detail
  const accountId:string = "7e0b50e0";
  const projects = allProjects.filter(p => p.account.id === accountId);
  const jobArrays = await Promise.all(projects.map(p => axios.get(`https://api.phraseapp.com/api/v2/projects/${p.id}/jobs?state=in_progress`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(email + ":" + password).toString('base64')}`,
        'User-Agent': 'PhraseJobs (derek@penandpillow.com)',
      }
    }).then(res => res.data)
  ));

  ctx.body = jobArrays;
})

router.get('/*', async (ctx) => {
  ctx.body = 'Hello!';
});

export default router;