<template>
  <div>
    <!-- <input type="text" :value="inputValue" @input="updateInput" />
      -->
    <input type="text" v-model="model">
    <button @click="handleClick">Submit</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// const props = defineProps({
//   inputValue: {
//     type: String,
//     required: true,
//   },
// });

// const emit = defineEmits(['update','updateInput']);


const model =defineModel()

// const handleClick=(e)=>{
//   emit('update', 'new value')
// }

// const updateInput=(e)=>{
//   console.log('子组件',e.target.value)
//   emit('updateInput', e.target.value)
// }
</script>

<style scoped>
/* Add your styles here */
</style>
