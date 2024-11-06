<template>
  <t-dialog
    header="新增书籍"
    :close-on-overlay-click="false"
    :close-btn="false"
    :footer="false"
    width="400px"
    :visible="true"
  >
    <t-form label-align="top" colon @submit="handleSubmit">
      <t-form-item label="书籍名称">
        <t-input
          maxlength="12"
          v-model="newBook.name"
          placeholder="请输入书籍名称，最长12字符"
        />
      </t-form-item>
      <t-form-item>
        <t-space>
          <t-button theme="primary" type="submit">保存</t-button>
          <t-button @click="close">取消</t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup>
import { defineEmits } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

const props = defineProps({
  newBook: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close', 'submit']);

const handleSubmit = e => {
  if (!props.newBook.name) {
    MessagePlugin.warning('请填写完整内容');
    return;
  }
  emit('submit', props.newBook);
  close();
};

const close = () => {
  emit('close');
};
</script>
