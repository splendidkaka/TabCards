<!-- VirtualListView.vue -->
<template>
  <div
    ref="scrollContainer"
    class="virtual-list-container"
    @scroll.passive="handleScroll"
  >
    <div class="scroll-placeholder" :style="{ height: totalHeight + 'px' }" />

    <div
      class="visible-content"
      :style="{ transform: `translateY(${offsetTop}px)` }"
    >
      <div
        v-for="item in visibleItems"
        :key="getItemKey(item)"
        :data-key="getItemKey(item)"
        class="list-item"
        ref="itemRefs"
      >
      <slot :item="item" :index="getItemIndex(item)"/> <!-- 这里调用了未定义的方法 -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
  type PropType,
} from "vue";

type ItemType = Record<string, any>;

const props = defineProps({
  items: {
    type: Array as PropType<ItemType[]>,
    required: true,
  },
  itemKey: {
    type: String,
    default: "id",
  },
  estimatedHeight: {
    type: Number,
    default: 50,
  },
  buffer: {
    type: Number,
    default: 3,
  },
});

const emit = defineEmits(["visible-change"]);

// 响应式状态
const scrollContainer = ref<HTMLElement | null>(null);
const itemRefs = ref<HTMLElement[]>([]);
const positions = ref<
  Array<{ key: string | number; top: number; bottom: number; height: number }>
>([]);
const visibleRange = ref({ start: 0, end: 0 });
const scrollRequest = ref<number | null>(null);

// 初始化位置缓存
const initPositions = () => {
  positions.value = props.items.map((item, index) => {
    const key = getItemKey(item);
    return {
      key,
      height: props.estimatedHeight,
      top: index * props.estimatedHeight,
      bottom: (index + 1) * props.estimatedHeight,
    };
  });
};

// 获取唯一键值
const getItemKey = (item: ItemType) => {
  return props.itemKey ? item[props.itemKey] : item.id;
};

const getItemIndex = (targetItem: ItemType) => {
  return props.items.findIndex(
    (item) => getItemKey(item) === getItemKey(targetItem)
  );
};
// 计算总高度
const totalHeight = computed(() => {
  return positions.value[positions.value.length - 1]?.bottom || 0;
});

// 计算可见项
const visibleItems = computed(() => {
  return props.items.slice(
    Math.max(0, visibleRange.value.start - props.buffer),
    Math.min(props.items.length, visibleRange.value.end + props.buffer)
  );
});

// 计算偏移量
const offsetTop = computed(() => {
  return positions.value[visibleRange.value.start]?.top || 0;
});

// 二分查找最近的索引
const findNearestIndex = (scrollTop: number) => {
  let low = 0;
  let high = positions.value.length - 1;
  let mid = 0;

  while (low <= high) {
    mid = Math.floor((low + high) / 2);
    const midBottom = positions.value[mid].bottom;

    if (midBottom < scrollTop) {
      low = mid + 1;
    } else if (midBottom > scrollTop) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  return low;
};

// 更新可见范围
const updateVisibleRange = () => {
  if (!scrollContainer.value) return;

  const scrollTop = scrollContainer.value.scrollTop;
  const containerHeight = scrollContainer.value.clientHeight;

  const start = findNearestIndex(scrollTop);
  const end = findNearestIndex(scrollTop + containerHeight);

  visibleRange.value = { start, end };
  emit("visible-change", { start, end });
};

// 滚动节流处理
const handleScroll = () => {
  if (!scrollRequest.value) {
    scrollRequest.value = requestAnimationFrame(() => {
      updateVisibleRange();
      scrollRequest.value = null;
    });
  }
};

// ResizeObserver 处理动态高度
const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const target = entry.target as HTMLElement;
    const key = target.dataset.key;
    if (!key) return;

    const newHeight = entry.contentRect.height;
    const index = positions.value.findIndex((p) => p.key.toString() === key);

    if (index === -1 || positions.value[index].height === newHeight) return;

    const oldHeight = positions.value[index].height;
    const diff = newHeight - oldHeight;

    positions.value[index].height = newHeight;
    positions.value[index].bottom = positions.value[index].top + newHeight;

    // 更新后续元素位置
    for (let i = index + 1; i < positions.value.length; i++) {
      positions.value[i].top = positions.value[i - 1].bottom;
      positions.value[i].bottom =
        positions.value[i].top + positions.value[i].height;
    }

    // 如果高度变化超过阈值，修正滚动位置
    if (Math.abs(diff) > 5) {
      nextTick(() => {
        if (scrollContainer.value) {
          scrollContainer.value.scrollTop = positions.value[index].top;
        }
      });
    }
  });
});

// 暴露给父组件的方法
const scrollToItem = (index: number) => {
  if (index >= 0 && index < positions.value.length && scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: positions.value[index].top,
      behavior: "smooth",
    });
  }
};

// 初始化 IntersectionObserver
let observer: IntersectionObserver | null = null;
const initIntersectionObserver = () => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // 可以在此处实现精细化的可视区域管理
      });
    },
    {
      root: scrollContainer.value,
      rootMargin: `${props.buffer * props.estimatedHeight}px`,
      threshold: 0.1,
    }
  );
};

// 生命周期
onMounted(() => {
  initPositions();
  initIntersectionObserver();
  updateVisibleRange();

  // 监听容器尺寸变化
  if (scrollContainer.value) {
    resizeObserver.observe(scrollContainer.value);
  }
});

onUnmounted(() => {
  observer?.disconnect();
  resizeObserver.disconnect();
  if (scrollRequest.value) {
    cancelAnimationFrame(scrollRequest.value);
  }
});

// 监听数据变化
watch(
  () => props.items,
  (newItems) => {
    initPositions();
    updateVisibleRange();
    nextTick(() => {
      itemRefs.value.forEach((el) => resizeObserver.observe(el));
    });
  },
  { deep: true }
);

// 监听元素引用变化
watch(itemRefs, (newRefs) => {
  newRefs.forEach((el) => {
    if (el) resizeObserver.observe(el);
  });
});

defineExpose({
  scrollToItem,
});
</script>

<style scoped>
.virtual-list-container {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  position: relative;
}

.scroll-placeholder {
  position: relative;
  width: 100%;
}

.visible-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  will-change: transform;
}

.list-item {
  box-sizing: border-box;
  width: 100%;
}
</style>
