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
            </div>
            <div class="tab-indicator" :style="indicatorStyle"></div>
        </div>

        <Transition name="slide-fade" mode="out-in">
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
        width: `calc(${elementWidth}% - 8px)`,
        transform: `translateX(calc(${100 * activeIndex.value}% + 4px))`,
        height: 'calc(100% - 8px)'
    };
});

const handleTabChange = (index) => {
    activeIndex.value = index;
    emit('tabChange', {
        index,
        tab: props.tabs[index]
    });
};
</script>

<style scoped lang="scss">
.tabs-container {
    $primary: #6366f1;
    $radius: 12px;
    $transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    background: white;
    border-radius: $radius;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .tabs-header {
        position: relative;
        display: flex;
        background: #f8fafc;
        padding: 8px;
        border-radius: $radius - 2px;
        margin: 8px;

        .tab-item {
            flex: 1;
            text-align: center;
            padding: 16px 24px;
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
                    // color: color.adjust($primary: -10%);
                }
            }

            &.active {
                .tab-label {
                    color: white;
                    font-weight: 600;
                }
            }
        }

        .tab-indicator {
            position: absolute;
            top: 4px;
            left: 4px;
            background: $primary;
            border-radius: 8px;
            transition: all $transition;
            box-shadow: 0 2px 8px rgba($primary, 0.2);
            z-index: 0;
        }
    }

    .tab-content {
        padding: 24px;
        background: white;
        line-height: 1.6;
        color: #475569;
    }
}

.slide-fade {

    &-enter-active,
    &-leave-active {
        transition: all 0.3s ease;
    }

    &-enter-from {
        opacity: 0;
        transform: translateY(-8px);
    }

    &-leave-to {
        opacity: 0;
        transform: translateY(8px);
    }
}
</style>