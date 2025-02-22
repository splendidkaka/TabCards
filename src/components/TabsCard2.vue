<template>
    <div class="card-tabs">
        <!-- 外层容器卡片 -->
        <div class="container-card">
            <!-- 选项卡片容器 -->
            <div class="options-wrapper">
                <div v-for="(tab, index) in tabs" :key="index" class="option-card"
                    :class="{ active: activeIndex === index }" @click="switchTab(index)">
                    {{ tab.title }}
                </div>
            </div>

            <!-- 内容区域 -->
            <div class="content-wrapper">
                <transition :name="transitionDirection" mode="out-in">
                    <div :key="activeIndex" class="content-card">
                        {{ tabs[activeIndex].content }}
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Tab {
    title: string
    content: string
}

const props = defineProps<{
    tabs: Tab[]
}>()

const activeIndex = ref(0)
const prevIndex = ref(0)

const transitionDirection = computed(() => {
    return activeIndex.value > prevIndex.value ? 'slide-left' : 'slide-right'
})

const switchTab = (index: number) => {
    prevIndex.value = activeIndex.value
    activeIndex.value = index
}
</script>

<style scoped>
.card-tabs {
    --card-border-color: #e4e7ed;
    --active-border-color: #409eff;
    --transition-duration: 0.3s;
}

/* 外层容器卡片样式 */
.container-card {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

/* 选项卡片容器布局 */
.options-wrapper {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    position: relative;
}

/* 单个选项卡片样式 */
.option-card {
    flex: 1;
    padding: 16px 24px;
    border: 2px solid var(--card-border-color);
    border-radius: 6px;
    cursor: pointer;
    transition: all var(--transition-duration) ease;
    position: relative;
    background: #f5f7fa;
    text-align: center;
    font-weight: 500;
    user-select: none;
}

/* 激活状态样式 */
.option-card.active {
    border-color: var(--active-border-color);
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

/* 内容卡片样式 */
.content-card {
    border: 1px solid var(--card-border-color);
    border-radius: 6px;
    padding: 24px;
    min-height: 150px;
}

/* 切换动画 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all var(--transition-duration) ease;
    position: absolute;
    width: 100%;
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.slide-right-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>