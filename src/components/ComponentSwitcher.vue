<template>
    <div class="component-switcher">
        <!-- 下拉选择框 -->
        <div class="select-wrapper" @click="toggleDropdown">
            <div class="selected-option">
                <span>{{ selectedLabel }}</span>
                <div class="arrow" :class="{ rotate: showDropdown }"></div>
            </div>

            <Transition name="slide-fade">
                <div v-show="showDropdown" class="options-container">
                    <div v-for="(option, index) in options" :key="index" class="option-item"
                        @click.stop="selectOption(option)">
                        {{ option.label }}
                    </div>
                </div>
            </Transition>
        </div>

        <!-- 子组件切换区域 -->
        <Transition 
        :name="transitionName" 
        mode="out-in">
            <component :is="currentComponent" class="component-content" :key="currentComponent" 
            :tabs="tabs" 
            />
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    options: {
        type: Array,
        required: true,
        validator: value => value.every(opt => opt.component && opt.label)
    },
    defaultIndex: {
        type: Number,
        default: 0
    },
    transitionType: {
        type: String,
        default: 'fade' // fade | slide
    },
    tabs: {
        type: Array,
        required: true,
        validator: value => value.every(tab => tab.title && tab.content)
    }
});

const emit = defineEmits(['change']);

const showDropdown = ref(false);
const selectedIndex = ref(props.defaultIndex);

// 计算属性
const currentComponent = computed(() =>
    props.options[selectedIndex.value].component
);

const selectedLabel = computed(() =>
    props.options[selectedIndex.value].label
);

const transitionName = computed(() =>
    `component-${props.transitionType}`
);

// 方法
const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
};

const selectOption = (option) => {
    const index = props.options.findIndex(opt => opt === option);
    if (index !== -1) {
        selectedIndex.value = index;
        emit('change', index);
    }
    showDropdown.value = false;
};

// 点击外部关闭下拉
const clickOutside = (e) => {
    if (!e.target.closest('.select-wrapper')) {
        showDropdown.value = false;
    }
};

watch(showDropdown, (val) => {
    if (val) {
        window.addEventListener('click', clickOutside);
    } else {
        window.removeEventListener('click', clickOutside);
    }
});
</script>

<style lang="scss" scoped>
.component-switcher {
    height: 500px;
    width: 800px;
    position: relative;
    // max-width: 600px;
    margin: 20px auto;

    .select-wrapper {
        position: relative;
        margin-bottom: 20px;
        cursor: pointer;

        .selected-option {
            padding: 12px 16px;
            background: #ffffff;
            border: 2px solid #e4e7ed;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;

            &:hover {
                border-color: #409eff;
            }

            .arrow {
                width: 12px;
                height: 12px;
                border-left: 2px solid #666;
                border-bottom: 2px solid #666;
                transform: rotate(-45deg);
                transition: transform 0.3s ease;

                &.rotate {
                    transform: rotate(135deg);
                }
            }
        }

        .options-container {
            position: absolute;
            top: 110%;
            left: 0;
            right: 0;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
            z-index: 10;
            overflow: hidden;
        }

        .option-item {
            padding: 10px 16px;
            transition: all 0.2s ease;

            &:hover {
                background: #f5f7fa;
                transform: translateX(4px);
            }

            &:not(:last-child) {
                border-bottom: 1px solid #ebeef5;
            }
        }
    }

    .component-content {
        border: 1px solid #ebeef5;
        border-radius: 8px;
        padding: 20px;
        background: #ffffff;
    }
}

/* 下拉框动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition:
        opacity 0.3s ease,
        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

/* 组件切换动画 */
.component-fade-enter-active,
.component-fade-leave-active {
    transition: opacity 0.3s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
    opacity: 0;
}

.component-slide-enter-active {
    transition: all 0.4s ease-out;
}

.component-slide-leave-active {
    transition: all 0.3s ease-in;
}

.component-slide-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.component-slide-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>