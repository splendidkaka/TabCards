<template>
    <div>{{ count }}</div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { defineExpose } from 'vue';
  
  const count = ref(0);
  
  const increment = () => {
    count.value+=2;
  };
  
  // 使用 defineExpose 暴露属性和方法
  defineExpose({
    count,
    increment
  });
  </script>