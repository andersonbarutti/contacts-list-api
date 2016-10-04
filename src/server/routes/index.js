'use strict';

import compose from 'koa-compose';
import Router from 'koa-router';
import importDir from 'import-dir';
import gen from './gen';

const routerConfigs = [
  { folder: 'base', prefix: '' },
  { folder: 'api', prefix: '/api' }
];

export default function routes() {
  const composed = routerConfigs.reduce((prev, curr) => {
    const routes = importDir('./' + curr.folder);
    const router = new Router({
      prefix: curr.prefix
    });

    Object.keys(routes).map(name => routes[name](router));

    return [router.routes(), router.allowedMethods(), ...prev];
  }, []);

  const routerToGen = new Router({
    prefix: '/api'
  });

  gen(routerToGen);

  return compose(
    composed.concat([
      routerToGen.routes(),
      routerToGen.allowedMethods()
    ])
  );
}
