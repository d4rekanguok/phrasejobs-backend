import axios from '../config/axios-phraseapp';

// custom middleware to do authorization
async function auth (ctx, next) {
  if (ctx.state.client !== undefined) await next();

  const { header } = ctx.request;
  if (header && header.authorization) {
    ctx.state.client = axios.create({
      headers: { 'Authorization': header.authorization }
    });
  } else {
    ctx.throw(401);
  }

  await next();
};

export default auth;