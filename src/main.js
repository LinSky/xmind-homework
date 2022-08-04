import { createApp } from 'vue';
import {ElTable, ElDatePicker, ElForm, ElFormItem, ElSelect, ElOption, ElButton, ElDialog, ElRadioGroup, ElRadio, ElInput} from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';

const app = createApp(App);

app.use(ElTable);
app.use(ElDatePicker);
app.use(ElForm);
app.use(ElFormItem);
app.use(ElSelect);
app.use(ElOption);
app.use(ElButton);
app.use(ElDialog);
app.use(ElRadioGroup);
app.use(ElRadio);
app.use(ElInput);

app.mount('#app')
