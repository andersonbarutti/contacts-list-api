'use strict';

import compose from 'koa-compose';
import convert from 'koa-convert';
import logger from 'koa-logger';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';
//import session from 'koa-generic-session';

export default function middleware() {
  return compose([
    logger(),
    convert(cors()),
    convert(bodyParser()),
//    convert(session()),
  ]);
}

export const create = (model) =>
  (ctx, next) => (ctx.state[model.name] = new model()) && next();

export const save = (model) => {
  return async (ctx, next) =>  {
    const interest = Object.assign(ctx.state[model.name], ctx.request.body);
    await interest.save();
    await next();
  }
}

export const findOne = (config) => (model) => {
  return async (ctx, next) => {
    const optional = (name) => ctx.params[name] || ctx.request.body[name];

    const interest = ctx.state[model.name] = await model.findOne({
      [config.name]: optional(config.name)
    });

    if (!config.throwFound ^ !!interest) {
       ctx.throw(config.throwCode || 404);
    }

    await next();
  }
}

export const findById = findOne({ name: '_id' });

export const index = ({route, model}) => (async (ctx) => {
  ctx.body = await model.find({});
});

export const response = ({route, model}) => (async (ctx) => {
  ctx.body = ctx.state.model;
});
