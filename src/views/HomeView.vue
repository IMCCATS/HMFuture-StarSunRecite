<script setup>
import dayjs from 'dayjs';
import { ref } from 'vue';

function getCurrentTimeState() {
  const now = dayjs();
  if (now.hour() < 6) {
    return '凌晨好';
  } else if (now.hour() < 9) {
    return '早上好';
  } else if (now.hour() < 12) {
    return '上午好';
  } else if (now.hour() < 14) {
    return '中午好';
  } else if (now.hour() < 17) {
    return '下午好';
  } else if (now.hour() < 19) {
    return '傍晚好';
  }
  return '晚上好';
}

const currentTimeState = ref(getCurrentTimeState());
const welcomeText = ref(`同学，${currentTimeState.value}。`);
</script>

<template>
  <main>
    <t-space style="width: 100%" direction="vertical">
      <t-card :title="welcomeText">
        <t-comment
          avatar="https://tdesign.gtimg.com/site/avatar.jpg"
          author="让我们开始吧"
          :content="
            '今天是' + dayjs().format('YYYY年MM月DD日，别忘了你的目标。')
          "
        />
      </t-card>
      <!--      <t-card title="个人情况">-->
      <!--        <t-space>-->
      <!--          <t-statistic-->
      <!--            title="Total Assets"-->
      <!--            :value="82.76"-->
      <!--            unit="%"-->
      <!--            trend="increase"-->
      <!--            color="green"-->
      <!--          />-->
      <!--          <t-statistic-->
      <!--            title="Total Assets"-->
      <!--            :value="82.76"-->
      <!--            unit="%"-->
      <!--            trend="increase"-->
      <!--            color="green"-->
      <!--          /><t-statistic-->
      <!--            title="Total Assets"-->
      <!--            :value="82.76"-->
      <!--            unit="%"-->
      <!--            trend="increase"-->
      <!--            color="blue"-->
      <!--          />-->
      <!--        </t-space>-->
      <!--      </t-card>-->
      <t-card title="待办事项">
        <t-empty description="你还没有待办事项哦" />
      </t-card>
      <t-card title="应用使用流程">
        <t-steps current-status="process" :current="2">
          <t-step-item title="选择书籍" content="从书库中新建并选中书籍" />
          <t-step-item title="添加资源" content="将背诵资源添加到书籍" />
          <t-step-item title="开始使用" content="开始背诵吧" />
        </t-steps>
      </t-card>
    </t-space>
  </main>
</template>
