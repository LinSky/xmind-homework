const csv = require('csvtojson');
const csvBillsFilePath = __dirname + '/bill.csv';
const csvCategoriesFilePath = __dirname + '/categories.csv';

/**
 * 获取账单数据
 * @param {*} ctx 
 * @returns 
 */
exports.getBills = async function (ctx) {
    //
    let bills = await csv().fromFile(csvBillsFilePath);

    if (ctx.args.month) {
        const [year, month] = ctx.args.month.split('-').map(el => el * 1);
        bills = bills.filter((bill) => {
            const bDate = new Date(bill.time * 1);
            return year === bDate.getFullYear() && month === bDate.getMonth() + 1;
        });
    }

    if (ctx.args.category) {
        bills = bills.filter((bill) => {
            return bill.category === ctx.args.category;
        });
    }

    return bills;
};

/**
 * 获取分类列表数据
 * @param {*} ctx 
 */
 exports.getCategories = async function (ctx) {
    let data = await csv().fromFile(csvCategoriesFilePath);

    return data;
};


/**
 * 保存账单
 * @param {*} ctx 
 */
 exports.saveBill = async function (ctx) {
    
    console.log(ctx.args, '-==--=args');
    // 操作csv写入

    return {};
};


