<script setup>
import { defineEmits, defineProps } from 'vue';

defineProps({
  resource: Object,
});
const emit = defineEmits(['close', 'submit']);

const handleSubmit = () => {
  emit('submit');
};

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <t-dialog
    :visible="true"
    header="编辑资源"
    confirm-btn="确定"
    cancel-btn="取消"
    @confirm="handleSubmit"
    @cancel="handleClose"
  >
    <t-form @submit="handleSubmit">
      <t-form-item label="名称">
        <t-input v-model="resource.name" placeholder="名称" />
      </t-form-item>
      <t-form-item label="内容">
        <t-textarea rows="4" v-model="resource.content" placeholder="内容" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
