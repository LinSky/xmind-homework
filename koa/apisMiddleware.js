const fs = require("fs");
const path = require('path');

exports.getApisMiddleware = function (filespath) {
    let methods = {};

    scanApiFiles(filespath);

    //扫描方法;
	function scanApiFiles(filespath) {
		fs.readdirSync(filespath).forEach(filename => {
			const fileDir = path.join(filespath, filename);
			//测试文件不作处理
			if (filename.match(/test\.js$/)) return;
			//后边test为null,用同步方法
			const stats = fs.statSync(fileDir);	//判断文件类型
			if (stats.isFile()) {//是文件
				//原逻辑
				if (!filename.match(/\.js$/)) return;

				let apis = require(fileDir);

				Object.keys(apis).forEach(m => {
                    if (methods[m]) throw new Error('重复定义的API方法: ' + m + ' file: ' + filename);
                    methods[m] = apis[m];
				});
			} else if (stats.isDirectory()) {//是文件夹
				scanApiFiles(fileDir);
			}
		});
	}

    /**
     * 
     */
    return async function (ctx) {
        ctx.args = ctx.request.body;
        let method = ctx.query.method;

        if (method) method = method.replace(/^[^\.]+\./, '');

        if (!method) ctx.error("没有method参数", 400);

        if (!methods[method]) ctx.error('未定义的接口:' + method, 404);

        /**
         * 执行逻辑代码
         * ctx.args 为前端传入参数
         */
        try {
            let re = await methods[method].call(ctx, ctx);
            ctx.ok(re);
        } catch (err) {
            throw err;
        }
    };
    
}