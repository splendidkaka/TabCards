<template>
    <div class="tabs-container">
        <div class="tabs-header">
            <div v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ 'active': activeIndex === index }"
                @click="changeTab(index)">
                <span class="tab-label">
                    <slot name="tabHeader" :tab="tab" :index="index">
                        {{ tab.title }}
                    </slot>
                </span>
            </div>
            <div class="tab-indicator" :style="indicatorStyle"></div>
        </div>

        <Transition name="fade-slide" mode="out-in">
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
    const elementWidth = 100 / props.tabs.length;
    return {
        width: `${elementWidth}%`,
        transform: `translateX(${100 * activeIndex.value}%)`
    };
});

const changeTab = (index) => {
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
    $primary: #4361ee;
    $radius: 12px;
    $transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    background: white;
    border-radius: $radius;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .tabs-header {
        position: relative;
        display: flex;
        background: #f8fafc;
        padding: 0.5rem;

        .tab-item {
            flex: 1;
            text-align: center;
            padding: 1rem 1.5rem;
            cursor: pointer;
            position: relative;
            z-index: 1;
            transition: color $transition;

            .tab-label {
                position: relative;
                font-weight: 500;
                color: #64748b;
                transition: color $transition;
            }

            &:hover:not(.active) {
                .tab-label {
                    color: darken($primary, 10%);
                }
            }

            &.active {
                .tab-label {
                    color: $primary;
                    font-weight: 600;
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
            transition: transform $transition;
            box-shadow: 0 2px 8px rgba($primary, 0.2);
        }
    }

    .tab-content {
        padding: 2rem;
        background: white;
        line-height: 1.6;
        color: #475569;
    }
}

.fade-slide {

    &-enter-active,
    &-leave-active {
        transition: all 0.3s ease;
    }

    &-enter-from {
        opacity: 0;
        transform: translateY(-10px);
    }

    &-leave-to {
        opacity: 0;
        transform: translateY(10px);
    }
}
</style>