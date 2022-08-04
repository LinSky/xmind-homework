<script setup>
import axios from 'axios'
import { computed, reactive, ref, watch } from 'vue'

// 账单列表
let bills = ref([]);
// 分类列表
let categories = ref([]);
// 查询参数
let params = reactive({
    month: '',
    category: ''
});
//
let dialogVisible = ref(false);
//
let billForm = reactive({
    type: '0',
    category: '',
    amount: '',
    time: ''
});

// 计算选择月份支出账单数据
const monthBillsByCategory = computed(()=>{
    if (!params.month) return [];

    let result = bills.value.filter(el => el.type * 1 === 0);
    let map = {};
    result.forEach((el) => {
        const category = el.category;
        if (map[category]) {
            map[category].amount = (map[category].amount * 100  + el.amount * 100)/100;
        } else {
            map[category] = {
                category: el.category,
                amount: el.amount * 1
            };
        }
    });
    
    return Object.values(map);
});

// 获取账单数据
function getBills () {
    axios.post('/api?method=getBills', {...params}).then((res) => {
        bills.value = res.data.data;
    });
}

// 获取账单分类列表
function getCategories () {
    axios.post('/api?method=getCategories').then((res) => {
        categories.value = res.data.data;
    });
}

getBills();
getCategories();

// 时间格式化
function formatterTime(time){
    const date = new Date(time * 1);
    return date.getFullYear() + '-' + (date.getMonth() + 1 +'').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0');
}

// 根据分类ID获取对应分类名称
function getCategoryNameById(id){
    return categories.value.find(el => el.id === id).name;
}

//
watch (params, () => {
    getBills();
})

//
function submitHandle () {
    billForm.time = new Date(billForm.time).getTime();
    axios.post('/api?method=saveBill', {...billForm}).then((res) => {
        
    });
}

</script>

<template>
    <div>
        <el-form :inline="true" :model="params" class="demo-form-inline">
            <el-form-item label="时间">
                <el-date-picker
                    v-model="params.month"
                    type="month"
                    value-format="YYYY-MM"
                    placeholder="选择月">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="类别">
                <el-select v-model="params.category" clearable placeholder="请选择">
                    <el-option
                        v-for="item in categories"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click=" dialogVisible = true">新增账单</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="bills" border style="width: 100%">
            <el-table-column label="账单类型" width="180">
                <template #default="scope">
                    <span>{{ scope.row.type == 0 ? '支出' : '收入' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="账单日期" width="180">
                <template #default="scope">
                    <span>{{ formatterTime(scope.row.time) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="category" label="账单分类">
                <template #default="scope">
                    <span>{{ getCategoryNameById(scope.row.category) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="amount" label="账单金额" width="180" />
        </el-table>
        <p>{{params.month}}月支出类型统计排序</p>
        <el-table v-if="params.month" :data="monthBillsByCategory" border :default-sort = "{prop: 'amount', order: 'descending'}">
            <el-table-column prop="category" label="账单分类" width="180">
                <template #default="scope">
                    <span>{{ getCategoryNameById(scope.row.category) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="amount" sortable label="账单金额" width="180" />
        </el-table>
    </div>
    <el-dialog v-model="dialogVisible" title="新增账单" width="30%" :before-close="handleClose" >
        <el-form label-position="right" label-width="100px" :model="billForm">
            <el-form-item label="账单类型">
                <el-radio-group v-model="billForm.type" class="ml-4">
                    <el-radio label="0">支出</el-radio>
                    <el-radio label="1">收入</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="账单分类">
                <el-select v-model="billForm.category" clearable placeholder="请选择" style="width: 100%">
                    <el-option
                        v-for="item in categories"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="账单金额">
                <el-input v-model="billForm.amount" />
            </el-form-item>
            <el-form-item label="账单时间">
                <el-date-picker
                    v-model="billForm.time"
                    type="datetime"
                    format="YYYY/MM/DD hh:mm:ss"
                    style="width: 100%"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitHandle">提交</el-button>
            </span>
        </template>
    </el-dialog>
    
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
