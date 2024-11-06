<template>
  <t-card title="关于我们">
    <t-typography-title level="h4">星阳背诵系统</t-typography-title>
    <t-typography-paragraph>
      愿每一个努力奔赴的人，都有完美的人生， regardless of the obstacles.
    </t-typography-paragraph>
    <t-typography-paragraph>
      <t-typography-text code
        >版本号：20241103(INSIDE_ALPHA)_FORDEV（内测专属版）
      </t-typography-text>
      <t-button theme="primary" variant="outline" @click="showMore"
        >检查更新
      </t-button>
    </t-typography-paragraph>
    <t-divider />
    <t-typography-title level="h4">畅哥集团 荣誉出品</t-typography-title>
    <t-typography-paragraph>
      © 2020 - {{ new Date().getFullYear() }} Changge Group.
      <br />
      Powered by HuiMengFuture Network Technology Studios.
    </t-typography-paragraph>
    <t-typography-paragraph>
      开发经理：小研同学
      <br />
      项目总监：乔嘉诚
      <br />
      特别致谢（无先后顺序）：腾讯云计算（北京）有限公司；佛山市爱达斯科技有限公司
      <!--      <br />-->
      <!--      腾讯云 提供计算服务-->
    </t-typography-paragraph>
  </t-card>
</template>

<script setup>
import { MessagePlugin } from 'tdesign-vue-next';

const showMore = () => {
  MessagePlugin.info(
    '内测专属版将永远保持最新状态，无需手动更新（除特殊情况外）。',
  );
};
</script>
