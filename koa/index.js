const path = require('path');
const Koa = require('koa');
const mount = require('koa-mount');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const bodyParser = require('koa-bodyparser');
const apisMiddleware = require('./apisMiddleware');






app.use(require('koa-static')(path.resolve('./dist')));

// error handle
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.status = err.status || 500;
        ctx.body = JSON.stringify({
            code: 0,
            success: false,
            msg: (err && err.message) ? err.message : JSON.stringify(err)
        });
    }
});

//
app.use(async (ctx, next) => {
    ctx.ok = (data) => {
        const resData = {
            msg: '',
            code: 1,
            data: data
        }

        ctx.body = JSON.stringify(resData);
    };
    ctx.error = (msg, status) => {
        let err = typeof msg == 'string' ? new Error(msg) : msg;
        if (typeof err === 'object') err.status = status || 200;
        throw err;
    };

    await next();
});

app.use(bodyParser());

router.post('/api', apisMiddleware.getApisMiddleware(__dirname + '/apis'));

app.use(router.routes());
 
app.listen(1024, () => {
    console.log('click: http://localhost:1024/');
});