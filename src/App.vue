<!-- ParentTimer.vue -->
<template>
  <div class="timer-container">
    <CountDown ref="timerRef" :initial-ms="initialTime" @time-up="handleTimeUp" />
    <div class="controls">
      <transition name="fade-move" mode="out-in">
        <button v-if="!isFinished" @click="toggleTimer" class="btn control-main" :class="{ running: isRunning }">
          {{ buttonText }}
        </button>
      </transition>
      <button @click="reset" class="btn reset" :class="{ 'reset-slide': isFinished }">重置</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import CountDown from './components/CountDown.vue';
import type { CountdownControls } from './utils/useCountdown';

const timerRef = ref<CountdownControls>();

// const start = () => timerRef.value?.start();
// const pause = () => timerRef.value?.pause();
// const reset = () => timerRef.value?.reset();

const isRunning = computed(() => timerRef.value?.isRunning ?? false);
const currentTime = computed(() => timerRef.value?.currentTime ?? initialTime.value);
const hasStarted = ref(false);
const initialTime = ref(5000);
const isFinished = ref(false);

const handleTimeUp = () => {
  console.log('时间到!');
  // 这里可以添加通知逻辑
};

// 动态按钮文本
const buttonText = computed(() => {
  if (!hasStarted.value && currentTime.value === initialTime.value) {
    return '开始';
  }
  return isRunning.value ? '暂停' : '继续';
});

// 切换计时状态
const toggleTimer = () => {
  if (!hasStarted.value) {
    hasStarted.value = true;
  }

  if (isRunning.value) {
    timerRef.value?.pause();
  } else {
    timerRef.value?.start();
  }
};

// 重置逻辑
const reset = () => {
  hasStarted.value = false;
  timerRef.value?.reset();
};

watch(currentTime, (newTime) => {
  isFinished.value = Number(newTime) <= 0;
});

onMounted(() => {
  console.log('currentTime', currentTime);
});
</script>

<!-- ParentTimer.vue 按钮样式优化 -->
<style scoped lang="scss">
/* 全局字体优化 */
body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 4rem;
}


.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 16px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  outline: none;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(145deg,
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0.1) 100%);
    border-radius: inherit;
  }

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(1px);
    filter: brightness(0.95);
  }

  &.start {
    background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
    color: white;
  }

  &.pause {
    background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
    color: white;
  }

  &.reset {
    background: linear-gradient(135deg, #F44336 0%, #EF5350 100%);
    color: white;
  }

  &.control-main {
  width: 100px;
  background: #4CAF50;
  color: white;
  
  &.running {
    background: #FFC107;
  }
}
}

.controls {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  position: relative;
  min-width: 220px; // 固定容器宽度防止跳动
  justify-content: center;
}

// 主按钮过渡动画
.fade-move-enter-active,
.fade-move-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-move-enter-from,
.fade-move-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.reset {
  background: #F44336;
  color: white;
  transform-origin: left center;
  
  &.expanded {
    grid-column: 1 / -1;
    transform: scaleX(2.05) translateX(-25%); // 精确计算扩展比例
  }
  &.reset-slide {
    grid-column: 1 / -1;
    animation: slide-expand 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
}

.btn-placeholder {
  width: 100px; // 匹配按钮宽度
  visibility: hidden;
}
// 重置按钮扩展动画
.reset.expanded {
  transition: all 0.6s 0.3s cubic-bezier(0.4, 0, 0.2, 1); // 添加延迟
}

@keyframes slide-expand {
  0% {
    transform: translateX(50%);
    opacity: 0.8;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
    // width: 100%;
  }
}
</style>