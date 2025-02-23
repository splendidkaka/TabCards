// useCountdown.ts
import { ref, onUnmounted, watch, type Ref } from 'vue';


//定义类型
export interface CountdownControls {
    currentTime: Ref<number>;
    isRunning: Ref<boolean>;
    start: () => void;
    pause: () => void;
    reset: (newTime?: number) => void;
}

//导出方法
export function useCountdown(initialMs: number): CountdownControls {
    const currentTime = ref(initialMs); // 使用毫秒为单位
    const isRunning = ref(false); // 是否正在倒计时
    let lastTimestamp = 0;  // 上一次时间戳
    let animationFrameId: number | null = null;  // requestAnimationFrame 的 id

    const updateTime = (timestamp: number) => {
        // console.log('updateTime', timestamp)
        if (!lastTimestamp) lastTimestamp = timestamp; // 初始化时间戳

        const elapsed = timestamp - lastTimestamp;
        if (elapsed >= 100) { // 每100ms更新一次保证流畅度
            currentTime.value = Math.max(0, currentTime.value - elapsed);
            lastTimestamp = timestamp;

            if (currentTime.value <= 0) {
                pause();
            }
        }

        if (isRunning.value) {
            animationFrameId = requestAnimationFrame(updateTime);
        }
    };

    const start = () => {
        if (!isRunning.value && currentTime.value > 0) { // 只有在倒计时未开始且时间大于0时才能开始
            isRunning.value = true;
            lastTimestamp = 0;
            animationFrameId = requestAnimationFrame(updateTime);
        } 
    };

    const pause = () => {
        isRunning.value = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    };

    const reset = (newTime?: number) => {
        pause();
        currentTime.value = newTime !== undefined ? newTime : initialMs;
    };

    onUnmounted(pause);

    watch(() => initialMs, (newVal) => {
        currentTime.value = newVal;
        console.log('currentTime', currentTime.value)
    });

    return {
        currentTime,
        isRunning,
        start,
        pause,
        reset
    };
}