<template>
  <main>
    <t-space style="width: 100%" direction="vertical">
      <t-card
        title="顺次背诵"
        :description="currentBook ? '当前书籍：' + currentBook.name : ''"
      >
        <div v-if="currentResource">
          <div class="question">{{ currentResource.name }}</div>
          <t-typography-paragraph>
            ({{ currentResourceIndex + 1 }}/{{ resources.length }})
          </t-typography-paragraph>
          <t-space style="margin-top: 16px">
            <t-button @click="backResource" :disabled="!hasBack"
              >上一个
            </t-button>
            <t-button @click="showAnswer"
              >{{ showingAnswer ? '隐藏' : '查看' }}答案
            </t-button>
            <t-button @click="nextResource" :disabled="!hasNext"
              >下一个
            </t-button>
          </t-space>
          <div v-if="showingAnswer" class="answer">
            {{ currentResource.content }}
          </div>
        </div>
        <div v-else>
          <p>当前没有资源可以背诵。</p>
        </div>
      </t-card>
    </t-space>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { useBookStore } from '@/stores/book';

const store = useBookStore();

const currentResourceIndex = ref(0);
const showingAnswer = ref(false);

const currentBook = computed(() => store.currentBook);
const resources = computed(() => {
  if (currentBook.value) {
    const savedResources = localStorage.getItem('resources');
    if (savedResources) {
      return JSON.parse(savedResources).filter(
        r => r.bookId === currentBook.value.id,
      );
    }
  }
  return [];
});

const currentResource = computed(() => {
  if (resources.value && resources.value.length > 0) {
    return resources.value[currentResourceIndex.value];
  }
  return null;
});

const hasNext = computed(() => {
  return currentResourceIndex.value < resources.value.length - 1;
});

const hasBack = computed(() => {
  return currentResourceIndex.value > 0;
});

const showAnswer = () => {
  showingAnswer.value = !showingAnswer.value;
};

const nextResource = () => {
  showingAnswer.value = false;
  if (hasNext.value) {
    currentResourceIndex.value++;
  } else {
    MessagePlugin.success('已背诵完所有资源');
    currentResourceIndex.value = 0;
  }
};

const backResource = () => {
  showingAnswer.value = false;
  if (hasBack.value) {
    currentResourceIndex.value--;
  } else {
    MessagePlugin.warning('已到达第一个资源');
  }
};

onMounted(() => {
  if (!currentBook.value) {
    MessagePlugin.warning('请选择一本书籍开始背诵');
  }
});
</script>

<style scoped>
.question {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

.answer {
  font-size: 16px;
  margin-top: 16px;
  background-color: #f0f0f0;
  padding: 16px;
  border-radius: 4px;
  white-space: pre-wrap;
}
</style>
