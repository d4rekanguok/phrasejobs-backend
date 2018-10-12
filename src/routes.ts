import Router from 'koa-router';
const router = new Router();

import { zipWith, isEmpty } from 'lodash';

import client from './config/axios-phraseapp';
import auth from './middleware/auth';

// Axios instance type
import { AxiosStatic } from 'axios';

interface Project {
  id: string;
  [propName: string]: any;
}

interface Job {
  id: string;
  [propName: string]: any;
}

interface Locale {
  id: string;
  [propName: string]: any;
}

router.post('/authorize', async (ctx) => {
  const { username, password }:any = ctx.request.body;

  const { data } = await client.post('authorizations', {
    note: 'phrasejobs',
    scopes: ['read', 'write']
  }, {
    auth: { username, password }
  });
  ctx.body = { token: data.token };
})

router.get('/jobs', auth, async (ctx) => {
  const client: AxiosStatic = ctx.state.client;

  const allProjects: Project[] = await client
    .get('projects')
    .then(res => res.data)
    .catch(err => ctx.throw(err))

  // todo: add project name into job detail
  const accountId: string | undefined = process.env.ACCOUNT_ID;
  if (accountId === undefined) ctx.throw(500, `No ACCOUNT_ID found in env`);

  const projects: Project[] = allProjects.filter(p => p.account.id === accountId);
  const jobArrays = await Promise.all(
    projects.map(
      (p: Project): Promise<Job[]> => client
        .get(`projects/${p.id}/jobs?state=in_progress`)
        .then(res => res.data)
        // todos: throw different error dependning on the error here
        // or just throw error & handle them in the error middleware
        .catch(err => ctx.throw(408, `Couldn't load jobs, please refresh`))
    )
  );

  // zip projects and jobs so we have all these info to send to client
  const jobWithProjects = zipWith(
    projects,
    jobArrays,
    (p, j) => ({ project: p, jobs: j })
  )
  .filter(({ jobs }) => !isEmpty(jobs))

  ctx.body = jobWithProjects;
})

router.get('/jobs/:projectId/:jobId', auth, async (ctx) => {
  const client: AxiosStatic = ctx.state.client;
  const { projectId, jobId } : { projectId: String, jobId: String } = ctx.params;

  const jobDetail: Locale[] = await client
    .get(`projects/${projectId}/jobs/${jobId}`)
    .then(res => res.data.locales)
    .catch(err => ctx.throw(400, err));
  
  ctx.body = jobDetail;
})

export default router;