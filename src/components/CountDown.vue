<!-- ChildTimer.vue -->
<template>
    <div class="timer-display" @mouseenter="showControls = true" @mouseleave="showControls = false">
        <div class="progress-ring" :style="{
            '--progress': (currentTime / initialMs) * 100,
            '--ring-color': ringColor
        }">
            <!-- 时间显示层 -->
            <div class="time-display">
                <span class="minutes">{{ formatted.minutes }}</span>
                <span class="colon">:</span>
                <span class="seconds">{{ formatted.seconds }}</span>
                <span class="millis">.{{ formatted.millis }}</span>
            </div>

            <!-- 控制按钮层 -->
            <transition name="fade-slide">
                <div v-if="showControls" class="controls-wrapper">
                    <div class="controls-container">
                        <button class="control-btn pause-btn" @click.stop="pause">
                            <span class="icon">⏸</span>
                            <span class="text">{{ isRunning ? '暂停' : '继续' }}</span>
                        </button>
                        <button class="control-btn reset-btn" @click.stop="reset()">
                            <span class="icon">↺</span>
                            <span class="text">重置</span>
                        </button>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useCountdown, type CountdownControls } from '../utils/useCountDown';

interface Props {
    initialMs: number; // 毫秒为单位
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'time-up'): void;
}>();

const { currentTime, isRunning, start, pause, reset } = useCountdown(props.initialMs);
const showControls = ref(false);

defineExpose<CountdownControls>({
    currentTime,
    isRunning,
    start,
    pause,
    reset: (newTime?: number) => reset(newTime ?? props.initialMs)
});

// 格式化时间显示
const formatted = computed(() => {
    const total = currentTime.value;
    const minutes = Math.floor(total / 60000);
    const seconds = Math.floor((total % 60000) / 1000);
    const millis = Math.floor(total % 1000);

    return {
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        millis: millis.toString().padStart(3, '0').slice(0, 2) // 显示两位毫秒
    };
});

// 进度条颜色计算
const ringColor = computed(() => {
    const progress = (currentTime.value / props.initialMs) * 100;
    return `hsl(${progress * 1.2}, 70%, 50%)`;
});

watch(currentTime, (val) => {
    if (val <= 0) emit('time-up');
});
</script>

<!-- ChildTimer.vue 优化样式 -->
<style scoped lang="scss">
.timer-display {
    position: relative;
    width: 240px;
    height: 240px;
    filter: drop-shadow(0 0 12px rgba(100, 120, 255, 0.1));

    &:hover .progress-ring::after {
        opacity: 1;
    }
}

.progress-ring {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(var(--ring-color) calc(var(--progress) * 1%),
            #f0f2ff calc(var(--progress) * 1%));
    transition: background 0.3s ease-out;
    cursor: pointer;
    transition: background 0.3s ease-out;

    &:hover {
        transform: scale(1.02);
    }

    &::before {
        content: '';
        position: absolute;
        inset: 8px;
        background: linear-gradient(145deg, #ffffff, #f5f7ff);
        border-radius: 50%;
        box-shadow:
            4px 4px 12px rgba(0, 0, 0, 0.05),
            -4px -4px 12px rgba(255, 255, 255, 0.8);
    }

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(4px);
    }
}

.time-display {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-family: 'Segoe UI', 'Roboto', system-ui, sans-serif;

    .minutes,
    .seconds {
        font-size: 2.6rem;
        font-weight: 700;
        color: #2d3250;
        letter-spacing: -1px;
        text-shadow: 0 2px 4px rgba(45, 50, 80, 0.1);
    }

    .millis {
        font-size: 1.4rem;
        font-weight: 500;
        color: #767c9c;
        letter-spacing: 1px;
    }

    .colon {
        font-size: 2.2rem;
        color: #a1a7c4;
        animation: pulse 1s infinite;
    }
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.4;
    }
}

.ring-controls {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.199);
    backdrop-filter: blur(4px);
}

.controls-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    z-index: 2; // 最顶层
}

.controls-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transform: translateY(20%);
    // background-color: #2d3250;
}

.control-btn {
    width: 100px;
    height: 44px;
    border: none;
    // border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    // background: linear-gradient(145deg, #ffffff, #f5f7ff);
    box-shadow:
        3px 3px 8px rgba(0, 0, 0, 0.1),
        -3px -3px 8px rgba(255, 255, 255, 0.8);

    &:hover {
        transform: scale(1.1);
        box-shadow:
            4px 4px 12px rgba(0, 0, 0, 0.15),
            -4px -4px 12px rgba(255, 255, 255, 0.9);

        &.pause-btn {
            background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
        }

        &.reset-btn {
            background: linear-gradient(135deg, #F44336 0%, #EF5350 100%);
        }
    }

    &:active {
        transform: scale(0.95);
    }

    svg {
        width: 60%;
        height: 60%;
        fill: #2d3250;
    }
}

// 动画效果
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

// 移动端适配
@media (max-width: 640px) {
    .ring-controls {
        gap: 1rem;
    }

    .control-btn {
        width: 40px;
        height: 40px;
    }
}
</style>