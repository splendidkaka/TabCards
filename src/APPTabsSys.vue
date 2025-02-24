<template>
    <div class="parent-container">
        <TabSystem v-model="tabState" @tab-change="handleTabChange" @tab-remove="handleTabRemove">
            <template #content="{ activeTab }">
                <div v-if="activeTab">
                    <input v-model="activeTab.content" placeholder="Enter tab content" class="content-input" />
                    <p>Current Content: {{ activeTab.content }}</p>
                </div>
                <div v-else class="no-tabs">
                    No active tabs
                </div>
            </template>
        </TabSystem>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TabSystem from './components/TabSystem.vue';

const tabState = ref({
    tabs: [
        {
            id: 1,
            label: 'First Tab',
            content: 'Initial content'
        }
    ],
    activeTab: 1
});

console.log('tabState',tabState.value);

const handleTabChange = (tabId) => {
    console.log('Active tab changed to:', tabId);
};

const handleTabRemove = (tabId) => {
    console.log('Tab removed:', tabId);
};
</script>

<style>
.parent-container {
    max-width: 800px;
    margin: 20px auto;
}

.content-input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.no-tabs {
    color: #888;
    font-style: italic;
    text-align: center;
    padding: 20px;
}
</style>