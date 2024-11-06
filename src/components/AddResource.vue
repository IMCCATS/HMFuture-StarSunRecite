<template>
  <t-dialog
    :visible="true"
    header="添加资源"
    confirm-btn="确定"
    cancel-btn="取消"
    @confirm="handleSubmit"
    @cancel="handleClose"
  >
    <t-form @submit="handleSubmit">
      <t-form-item label="名称">
        <t-input v-model="newResource.name" placeholder="名称" />
      </t-form-item>
      <t-form-item label="内容">
        <t-textarea rows="4" v-model="newResource.content" placeholder="内容" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

defineProps({
  newResource: Object,
});
const emit = defineEmits(['close', 'submit']);

const handleSubmit = () => {
  emit('submit');
};

const handleClose = () => {
  emit('close');
};
</script>
