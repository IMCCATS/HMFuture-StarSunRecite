<template>
  <main>
    <t-space style="width: 100%" direction="vertical">
      <t-card
        title="随机抽词背诵"
        :description="currentBook ? '当前书籍：' + currentBook.name : ''"
      >
        <div v-if="currentResource">
          <div class="question">{{ currentResource.name }}</div>
          <t-space style="margin-top: 16px">
            <t-button @click="showAnswer"
              >{{ showingAnswer ? '隐藏' : '查看' }}答案
            </t-button>
            <t-button @click="nextRandomResource">随机一个！</t-button>
            <t-button @click="checkAnswers">检查答案</t-button>
            <t-space align="center">
              <t-input-number
                v-model="numBlanks"
                :min="1"
                :max="10"
                style="width: 100px; margin-left: 16px"
              />
              <span style="margin-left: 8px">空数</span></t-space
            >
            <t-space align="center">
              <t-input-number
                v-model="blankLength"
                :min="1"
                :max="10"
                style="width: 100px; margin-left: 16px"
              />
              <span style="margin-left: 8px">空长</span></t-space
            >
          </t-space>
          <div class="masked-content" v-html="maskedContent"></div>
          <div v-if="showingAnswer" class="answer">
            {{ currentResource.content }}
          </div>
          <div v-if="!showingAnswer" class="user-answers">
            <div v-for="(answer, index) in userAnswers" :key="index">
              空{{ index + 1 }}:
              <t-input
                v-model="userAnswers[index]"
                style="width: 100px; margin-right: 8px"
              />
            </div>
          </div>
          <t-typography-paragraph>
            如果您遇到多个空格连在一起的情况，请根据空格数量和长度的要求进行填空。部分内容可能因顺序不同导致您的填空答案无法通过校验，请以具体内容为准。
          </t-typography-paragraph>
        </div>
        <div v-else>
          <p>当前没有资源可以背诵。</p>
        </div>
      </t-card>
    </t-space>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useBookStore } from '@/stores/book'

const store = useBookStore();

const currentResourceIndex = ref(0);
const showingAnswer = ref(false);
const maskedContent = ref('');
const userAnswers = ref([]);
const correctAnswers = ref([]);
const numBlanks = ref(3); // 默认空数
const blankLength = ref(2); // 默认空长

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

const showAnswer = () => {
  showingAnswer.value = !showingAnswer.value;
};

const nextRandomResource = () => {
  showingAnswer.value = false;
  userAnswers.value = [];
  correctAnswers.value = [];

  if (resources.value.length > 0) {
    currentResourceIndex.value = Math.floor(
      Math.random() * resources.value.length,
    );
    maskWords(currentResource.value.content);
  } else {
    MessagePlugin.warning('当前没有资源可以背诵');
  }
};
const maskWords = content => {
  if (!content || typeof content !== 'string') {
    console.error('Invalid content:', content);
    return;
  }

  // 获取内容的长度
  const contentLength = content.length;
  if (contentLength === 0) {
    console.warn('No content to mask');
    return;
  }

  // 计算需要挖空的字符数量
  const numCharsToMask = Math.max(0, Math.min(contentLength, numBlanks.value));
  const blankLengthValue = Math.max(1, blankLength.value); // 确保空长至少为1
  const maxPossibleBlanks = Math.floor(contentLength / blankLengthValue);
  const actualNumBlanks = Math.min(numCharsToMask, maxPossibleBlanks);

  const maskedIndices = new Set();
  const punctuationRegex = /[.,!?;:\s\u3000-\u303F\uFF00-\uFFEF]/; // 包括英文和中文标点符号

  // 使用 Fisher-Yates 洗牌算法生成随机起始索引
  const possibleStartIndices = Array.from(
    { length: contentLength - blankLengthValue + 1 },
    (_, i) => i,
  ).filter(index => !punctuationRegex.test(content[index]));

  const shuffledIndices = possibleStartIndices.sort(() => 0.5 - Math.random());

  let blanksAdded = 0;
  for (
    let i = 0;
    i < shuffledIndices.length && blanksAdded < actualNumBlanks;
    i++
  ) {
    const startIndex = shuffledIndices[i];
    let validBlank = true;

    for (let j = 0; j < blankLengthValue; j++) {
      if (punctuationRegex.test(content[startIndex + j])) {
        validBlank = false;
        break;
      }
    }

    if (validBlank) {
      for (let j = 0; j < blankLengthValue; j++) {
        maskedIndices.add(startIndex + j);
      }
      blanksAdded++;
    }
  }

  correctAnswers.value = Array.from(maskedIndices)
    .sort((a, b) => a - b) // 确保索引按升序排序
    .reduce((acc, index, idx) => {
      if (idx % blankLengthValue === 0) {
        acc.push(content.slice(index, index + blankLengthValue));
      }
      return acc;
    }, []);

  maskedContent.value = Array.from(content)
    .map((char, index) =>
      maskedIndices.has(index)
        ? `<t-typography-text style="color: red; font-weight: bold; background-color: yellow; padding: 2px 4px; border-radius: 4px;">${''.padEnd(blankLengthValue, '-')}</t-typography-text>`
        : char,
    )
    .join('');

  userAnswers.value = new Array(blanksAdded).fill('');
};

const checkAnswers = () => {
  if (userAnswers.value.length !== correctAnswers.value.length) {
    MessagePlugin.warning('请填写所有空格');
    return;
  }

  const errors = userAnswers.value
    .map((userAnswer, index) => {
      const correctAnswer = correctAnswers.value[index].trim().toLowerCase();
      const userAnswerTrimmed = userAnswer.trim().toLowerCase();

      if (userAnswerTrimmed !== correctAnswer) {
        return {
          index: index + 1,
          userAnswer: userAnswer,
          correctAnswer: correctAnswer,
        };
      }

      return null;
    })
    .filter(error => error !== null);

  if (errors.length === 0) {
    MessagePlugin.success('全部正确！');
    showAnswer();
  } else {
    const errorMessages = errors
      .map(error => {
        return `空${error.index}有误哦：您输入的是“${error.userAnswer”`;
      })
      .join('\n');

    MessagePlugin.error(`有错误，请检查后重试。\n${errorMessages}`);
  }
};

onMounted(() => {
  if (!currentBook.value) {
    MessagePlugin.warning('请选择一本书籍开始背诵');
  } else {
    nextRandomResource();
  }
});
</script>

<style scoped>
.question {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

.masked-content {
  font-size: 16px;
  margin-top: 16px;
  white-space: pre-wrap;
}

.answer {
  font-size: 16px;
  margin-top: 16px;
  background-color: #f0f0f0;
  padding: 16px;
  border-radius: 4px;
  white-space: pre-wrap;
}

.user-answers {
  margin-top: 16px;
}

.user-answers .t-input {
  width: 100px;
  margin-right: 8px;
}
</style>
