<!-- TabsCard.vue -->
<template>
    <div class="tabs-container">
        <div class="tabs-header">
            <div v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ 'active': activeIndex === index }"
                @click="handleTabChange(index)">
                <span class="tab-label">
                    <slot name="tabHeader" :tab="tab" :index="index">
                        {{ tab.title }}
                    </slot>
                </span>
                <div class="tab-hover-effect"></div>
            </div>
            <div class="tab-indicator" :style="indicatorStyle"></div>
        </div>

        <Transition name="scale-fade" mode="out-in">
            <div :key="activeIndex" class="tab-content">
                <slot name="tabContent" :tab="currentTab" :index="activeIndex">
                    {{ currentTab.content }}
                </slot>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    tabs: {
        type: Array,
        required: true,
        validator: value => value.every(tab => tab.title && tab.content)
    },
    initialTab: {
        type: Number,
        default: 0,
        validator: value => value >= 0
    }
});

const emit = defineEmits(['tabChange']);

const activeIndex = ref(props.initialTab);

const currentTab = computed(() => props.tabs[activeIndex.value]);

const indicatorStyle = computed(() => {
    if (props.tabs.length === 0) return {};
    const elementWidth = 100 / props.tabs.length;
    return {
        width: `${elementWidth}%`,
        transform: `translateX(${100 * activeIndex.value}%)`,
        transition: `transform ${animationDuration} cubic-bezier(0.4, 0, 0.2, 1)`
    };
});

const animationDuration = '0.4s';

const handleTabChange = (index) => {
    activeIndex.value = index;
    emit('tabChange', {
        index,
        tab: props.tabs[index]
    });
};
</script>

<style scoped lang="scss">
@use "sass:math";

.tabs-container {
    $primary: #6366f1;
    $radius: 16px;
    $transition: cubic-bezier(0.4, 0, 0.2, 1);

    background: white;
    border-radius: $radius;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .tabs-header {
        position: relative;
        display: flex;
        background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
        padding: 0.75rem;

        .tab-item {
            flex: 1;
            text-align: center;
            padding: 1.25rem 2rem;
            cursor: pointer;
            position: relative;
            z-index: 1;
            transition: all 0.3s $transition;

            .tab-label {
                position: relative;
                font-weight: 500;
                color: #64748b;
                transition: color 0.3s $transition;
                z-index: 2;
            }

            .tab-hover-effect {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 110%;
                height: 140%;
                background: rgba($primary, 0.1);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                transition: transform 0.3s $transition;
            }

            &:hover {
                .tab-hover-effect {
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            &.active {
                .tab-label {
                    color: $primary;
                    font-weight: 600;
                }

                .tab-hover-effect {
                    background: rgba($primary, 0.15);
                    transform: translate(-50%, -50%) scale(1);
                }
            }
        }

        .tab-indicator {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: $primary;
            border-radius: 2px 2px 0 0;
            box-shadow: 0 2px 8px rgba($primary, 0.2);
        }
    }

    .tab-content {
        padding: 2.5rem;
        background: white;
        line-height: 1.6;
        color: #475569;
        font-size: 1.05rem;
    }
}

/* 更精致的过渡动画 */
.scale-fade {

    &-enter-active,
    &-leave-active {
        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &-enter-from {
        opacity: 0;
        transform: translateY(-8px) scale(0.98);
    }

    &-leave-to {
        opacity: 0;
        transform: translateY(8px) scale(0.98);
    }
}
</style>