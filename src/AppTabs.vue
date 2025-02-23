<template>
  <ComponentSwitcher
    :options="componentOptions"
    transition-type="slide"
    @change="handleComponentChange"
    :tabs="tabs"
  />
</template>

<script setup>
import ComponentSwitcher from './components/ComponentSwitcher.vue';
import TabComponent1 from './components/TabsCard.vue';
import TabComponent2 from './components/TabsCard2.vue';
import TabComponent3 from './components/TabsCard3.vue';
import TabComponent4 from './components/TabsCard4.vue';
import CountDown from './components/CountDown.vue';

const componentOptions = [
  { label: '组件一', component: TabComponent1 },
  { label: '组件二', component: TabComponent2 },
  { label: '组件三', component: TabComponent3 },
  { label: '组件四', component: TabComponent4 },
  { label: '倒计时', component: CountDown }
];


const tabs = [
  { title: '仪表盘', content: '这里是仪表盘内容...' },
  { title: '分析', content: '数据分析页面...' },
  { title: '设置', content: '系统设置选项...' }
];
const handleComponentChange = (index) => {
  console.log('当前组件:', index);
};
</script>