import mongoose from 'mongoose';
import routes from './gen.config';
import {
  index,
  findOne,
  findById,
  create,
  save,
  response
} from '../../middleware';

const generateRoutes = (router, params) => {
  console.log(`generate route for /${params.route}`);
  router
    // GET /api/{route.name} - Get item list
    .get(`/${params.route}`,
      index(params))

    // GET /api/{route.name}/:itemId - Get item
    .get(`/${params.route}/:_id`,
      findById(params.model),
      response(params))

    // POST /api/{route.name} - Create item
    .post(`/${params.route}`,
      create(params.model),
      save(params.model),
      response(params))

    // PUT /api/{route.name}/:itemId - Update item
    .put(`/${params.route}/:_id`,
      findById(params.model),
      save(params.model),
      response(params)
    )
  ;
}

export default (router) => Object.keys(routes).reduce(
  (prev, key) => {
    const params = routes[key];
    let { model, auth } = params;
    model = model || params;

    return generateRoutes(router, {
      route: key,
      model: mongoose.model(model),
      auth
    })
  }, {}
);
