<template>
    <input v-model="question" />
    <p>{{ answer }}</p>
</template>


<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('This is answer. ;-)')

// 侦听一个 ref
watch(question,  (newQuestion, oldQuestion) => {
    answer.value = newQuestion+'old'+oldQuestion
})
</script>
