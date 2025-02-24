<template>
    <div class="tab-system">
        <div class="tab-header">
            <draggable v-model="tabsCopy" class="scroll-container" item-key="id" @update:model-value="handleDragUpdate"
                @start="drag = true" @end="drag = false">
                <template #item="{ element }">
                    <div class="tab-item" :class="{ 'active': element.id === modelValue.activeTab }"
                        @click="selectTab(element.id)" @contextmenu.prevent="openContextMenu(element.id, $event)">
                        <span class="drag-handle">↕</span>
                        <span class="tab-label">{{ element.label }}</span>
                        <span class="tab-close" @click.stop="closeTab(element.id)">×</span>
                    </div>
                </template>
            </draggable>
            <button class="tab-add" @click="addTab">+</button>
        </div>

        <!-- 右键菜单 -->
        <teleport to="body">
            <div v-if="contextMenu.visible" class="context-menu"
                :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }">
                <div class="menu-item" @click="closeCurrentTab">关闭标签页</div>
                <div class="menu-item" @click="closeOtherTabs">关闭其他标签页</div>
                <div class="menu-item" @click="closeTabsToRight">关闭右侧标签页</div>
                <div class="menu-item" @click="closeAllTabs">关闭所有标签页</div>
            </div>
        </teleport>

        <!-- 内容区域 -->
        <div class="tab-content">
            <slot name="content" :activeTab="activeTabContent"></slot>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive } from 'vue';
import draggable from 'vuedraggable';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
        default: () => ({
            tabs: [],
            activeTab: null
        })
    }
});

const emit = defineEmits(['update:modelValue', 'tab-change', 'tab-remove']);

// 右键菜单状态
const contextMenu = reactive({
    visible: false,
    x: 0,
    y: 0,
    selectedTabId: null
});

// 打开右键菜单
const openContextMenu = (tabId, event) => {
    contextMenu.visible = true;
    contextMenu.x = event.clientX;
    contextMenu.y = event.clientY;
    contextMenu.selectedTabId = tabId;
};

// 关闭菜单
const closeContextMenu = () => {
    contextMenu.visible = false;
};


// 点击外部关闭菜单
onMounted(() => {
    document.addEventListener('click', closeContextMenu);
});

onUnmounted(() => {
    document.removeEventListener('click', closeContextMenu);
});

// 关闭当前标签页
const closeCurrentTab = () => {
    if (props.modelValue.tabs.length > 1) {
        closeTab(contextMenu.selectedTabId);
    }
    closeContextMenu();
};

// 关闭其他标签页
const closeOtherTabs = () => {
    const keepTabs = props.modelValue.tabs.filter(
        tab => tab.id === contextMenu.selectedTabId
    );

    emit('update:modelValue', {
        tabs: keepTabs,
        activeTab: contextMenu.selectedTabId
    });

    closeContextMenu();
};

// 关闭右侧标签页
const closeTabsToRight = () => {
    const currentIndex = props.modelValue.tabs.findIndex(
        tab => tab.id === contextMenu.selectedTabId
    );

    const newTabs = props.modelValue.tabs.slice(0, currentIndex + 1);

    emit('update:modelValue', {
        tabs: newTabs,
        activeTab: contextMenu.selectedTabId
    });

    closeContextMenu();
};

// 关闭所有标签页
const closeAllTabs = () => {
    if (props.modelValue.tabs.length === 0) return;

    // 保留第一个标签页
    const firstTab = props.modelValue.tabs;

    emit('update:modelValue', {
        tabs: [firstTab],
        activeTab: firstTab.id
    });

    closeContextMenu();
};

const activeTabContent = computed(() =>
    props.modelValue.tabs.find(t => t.id === props.modelValue.activeTab)
);

const addTab = () => {
    console.log('props.modelValue',props.modelValue);
    const newState = { ...props.modelValue };
    console.log('newState',newState);
    const newTab = {
        id: Date.now(),
        label: `New Tab ${newState.tabs.length + 1}`,
        content: ''
    };

    newState.tabs.push(newTab);
    newState.activeTab = newTab.id;
    emit('update:modelValue', newState);
};

const closeTab = (tabId) => {
    if (props.modelValue.tabs.length === 1) {
        return;
    }
    const newState = { ...props.modelValue };
    const tabIndex = newState.tabs.findIndex(t => t.id === tabId);

    if (tabIndex > -1) {
        newState.tabs.splice(tabIndex, 1); //

        if (newState.activeTab === tabId) {
            newState.activeTab = newState.tabs[Math.max(0, tabIndex - 1)]?.id || null;
        }

        emit('tab-remove', tabId);
        emit('update:modelValue', newState);
    }
};

const selectTab = (tabId) => {
    const newState = { ...props.modelValue };
    newState.activeTab = tabId;
    emit('tab-change', tabId);
    emit('update:modelValue', newState);
};

const tabsCopy = computed({
    get: () => props.modelValue.tabs,
    set: (value) => {
        emit('update:modelValue', {
            ...props.modelValue,
            tabs: value
        });
    }
});

// 处理拖拽更新
const handleDragUpdate = () => {
    // 自动触发数据更新
    console.log('Dragged!');
};

</script>

<style scoped>
.tab-system {
    width: 800px;
    /* 固定宽度 */
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-header {
    position: relative;
    background: #f8f9fa;
    border-bottom: 2px solid #e9ecef;
    padding-right: 48px;
    /* 为添加按钮留空间 */
}

.scroll-container {
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: thin;
    scrollbar-color: #adb5bd #f8f9fa;
    padding: 8px 0;
}

.tab-item {
    display: inline-flex;
    align-items: center;
    padding: 8px 20px;
    margin: 0 4px;
    background: #ffffff;
    border: 1px solid #dee2e6;
    border-radius: 6px 6px 0 0;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    top: 1px;
}

.tab-item.active {
    background: #e7f5ff;
    border-color: #4dabf7;
    color: #1864ab;
    border-bottom-color: transparent;
    z-index: 1;
}

.tab-item:hover {
    background: #f1f3f5;
}

.tab-label {
    font-weight: 500;
    font-size: 14px;
}

.tab-close {
    margin-left: 8px;
    color: #868e96;
    font-size: 16px;
    line-height: 1;
    padding: 2px;
    border-radius: 50%;
    transition: all 0.2s;
}

.tab-close:hover {
    background: #ff6b6b;
    color: white;
}

.tab-add {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: #4dabf7;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
    z-index: 2;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-add:hover {
    background: #228be6;
}

.tab-content {
    padding: 20px;
    min-height: 200px;
    background: white;
}

/* 自定义滚动条样式 */
.scroll-container::-webkit-scrollbar {
    height: 6px;
}

.scroll-container::-webkit-scrollbar-track {
    background: #f8f9fa;
}

.scroll-container::-webkit-scrollbar-thumb {
    background: #adb5bd;
    border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
    background: #868e96;
}

.context-menu {
    position: fixed;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    min-width: 160px;
}

.menu-item {
    padding: 8px 16px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    transition: background 0.2s;
}

.menu-item:hover {
    background: #f5f5f5;
}

/* 新增拖拽相关样式 */
.drag-handle {
    margin-right: 8px;
    cursor: move;
    color: #adb5bd;
    transition: color 0.2s;
}

.tab-item:hover .drag-handle {
    color: #495057;
}

/* 拖拽效果 */
.sortable-chosen {
    opacity: 0.8;
    background: #f8f9fa !important;
}

.sortable-ghost {
    background: #e9ecef !important;
    border: 2px dashed #4dabf7 !important;
    opacity: 0.6;
}
</style>