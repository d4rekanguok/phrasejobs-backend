import axios from '../config/axios-phraseapp';
import { decrypt } from '../helpers/crypto';

// custom middleware to do authorization
async function auth (ctx, next) {
  if (ctx.state.client !== undefined) await next();

  const { header } = ctx.request;
  if (header && header.authorization) {
    const [ type, key ] = header.authorization.split(' ');
    if (key === undefined) ctx.throw(401);
    const authorization = `${type} ${decrypt(key)}`;

    ctx.state.client = axios.create({
      headers: { 'Authorization': authorization }
    });
  } else {
    ctx.throw(401);
  }

  await next();
};

export default auth;