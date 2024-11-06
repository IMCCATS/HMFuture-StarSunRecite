<template>
  <main>
    <t-space style="width: 100%" direction="vertical">
      <t-card
        title="背诵资源管理"
        :description="selectedBook ? '当前书籍：' + selectedBook.name : ''"
      >
        <t-space style="margin-bottom: 16px">
          <t-button @click="addResource">添加资源</t-button>
          <t-button @click="exportResources">导出资源</t-button>
          <t-button @click="importResources">导入资源</t-button>
          <t-button @click="clearResources" type="danger">清空资源</t-button>
        </t-space>

        <t-table
          v-if="selectedBook"
          row-key="id"
          :data="filteredResources"
          :columns="columns"
          :stripe="true"
          :bordered="true"
          :hover="true"
          :table-layout="'fixed'"
          :size="'medium'"
          :pagination="pagination"
          :show-header="true"
          cell-empty-content="-"
          resizable
          lazy-load
          @row-click="handleRowClick"
          @select-change="handleSelectChange"
        >
          <template #action="{ row }">
            <t-space>
              <t-button size="small" @click="editResource(row)">编辑</t-button>
              <t-button size="small" @click="deleteResource(row)"
                >删除
              </t-button>
            </t-space>
          </template>
        </t-table>
        <div v-else>
          <p>请选择一本书籍开始管理资源。</p>
        </div>
      </t-card>
    </t-space>

    <!-- 添加资源模态框 -->
    <AddResource
      v-if="isAdding"
      :new-resource="newResource"
      @close="closeAddResource"
      @submit="submitAddResource"
    />

    <!-- 编辑资源模态框 -->
    <EditResource
      v-if="isEditing"
      :resource="editingResource"
      @close="closeEditResource"
      @submit="submitEditResource"
    />
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import AddResource from '@/components/AddResource.vue';
import EditResource from '@/components/EditResource.vue';
import { useBookStore } from '@/stores/book';

const store = useBookStore();

const books = computed(() => store.books);
const selectedBook = ref(store.currentBook);

const resources = ref([]);
const selectedRows = ref([]);
const isAdding = ref(false);
const isEditing = ref(false);
const newResource = reactive({
  name: '',
  content: '',
  bookId: null,
});
const editingResource = ref(null);

const columns = ref([
  { colKey: 'id', title: 'ID', width: '100' },
  { colKey: 'name', title: '名称', width: '200' },
  { colKey: 'content', title: '内容', ellipsis: true },
  { colKey: 'action', title: '操作', align: 'center', width: '200' },
]);

const pagination = {
  defaultCurrent: 1,
  defaultPageSize: 5,
  total: 0,
};

const filteredResources = computed(() => {
  if (!selectedBook.value) return [];
  return resources.value.filter(r => r.bookId === selectedBook.value.id);
});

const loadResources = async () => {
  try {
    if (!selectedBook.value) return;
    const savedResources = localStorage.getItem('resources');
    if (savedResources) {
      resources.value = JSON.parse(savedResources);
    }
    pagination.total = filteredResources.value.length;
  } catch (error) {
    MessagePlugin.error('加载资源失败');
  }
};

const saveResources = async () => {
  try {
    const allResources = JSON.parse(localStorage.getItem('resources') || '[]');
    const updatedResources = allResources.filter(
      r => r.bookId !== selectedBook.value.id,
    );
    updatedResources.push(...filteredResources.value);
    localStorage.setItem('resources', JSON.stringify(updatedResources));
    MessagePlugin.success('资源已更新');
    await loadResources();
  } catch (error) {
    MessagePlugin.error('保存资源失败');
  }
};

const addResource = () => {
  isAdding.value = true;
  newResource.bookId = selectedBook.value?.id;
};

const closeAddResource = () => {
  isAdding.value = false;
  newResource.name = '';
  newResource.content = '';
};

const submitAddResource = () => {
  if (!newResource.name || !newResource.content) {
    MessagePlugin.warning('请填写完整内容');
    return;
  }
  const newId =
    resources.value.length > 0
      ? resources.value[resources.value.length - 1].id + 1
      : 1;
  const resource = {
    id: newId,
    name: newResource.name,
    content: newResource.content,
    bookId: newResource.bookId,
    created_at: new Date().toISOString(),
  };
  resources.value.push(resource);
  saveResources();
  closeAddResource();
};

const editResource = row => {
  isEditing.value = true;
  editingResource.value = { ...row };
};

const closeEditResource = () => {
  isEditing.value = false;
  editingResource.value = null;
};

const submitEditResource = () => {
  if (!editingResource.value.name || !editingResource.value.content) {
    MessagePlugin.warning('请填写完整内容');
    return;
  }
  const index = resources.value.findIndex(
    r => r.id === editingResource.value.id,
  );
  if (index !== -1) {
    resources.value[index] = editingResource.value;
    saveResources();
  }
  closeEditResource();
};

const deleteResource = row => {
  const confirmDia = DialogPlugin({
    header: '删除资源',
    body: '确定要删除此资源吗？',
    confirmBtn: '确定',
    cancelBtn: '取消',
    onConfirm: async () => {
      const index = resources.value.findIndex(r => r.id === row.id);
      if (index !== -1) {
        resources.value.splice(index, 1);
        await saveResources();
      }
      confirmDia.hide();
    },
    onClose: () => {
      confirmDia.hide();
    },
  });
};

const clearResources = () => {
  const confirmDia = DialogPlugin({
    header: '清空资源',
    body: '确定要清空当前书籍的所有资源吗？此操作不可撤销！',
    confirmBtn: '确定',
    cancelBtn: '取消',
    onConfirm: async () => {
      resources.value = resources.value.filter(
        r => r.bookId !== selectedBook.value.id,
      );
      await saveResources();
      MessagePlugin.success('资源已清空');
      confirmDia.hide();
    },
    onClose: () => {
      confirmDia.hide();
    },
  });
};

const exportResources = () => {
  const csvData = Papa.unparse(filteredResources.value);
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'resources.csv');
  MessagePlugin.success('资源已导出');
};

const importResources = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';
  input.onchange = async e => {
    const file = e.target.files[0];
    if (file) {
      try {
        const results = await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            complete: results => resolve(results),
            error: err => reject(err),
          });
        });

        const importedResources = results.data.map(resource => ({
          ...resource,
          bookId: selectedBook.value.id,
        }));

        const existingResources = filteredResources.value.map(r => ({
          name: r.name,
          content: r.content,
        }));

        const validResources = importedResources.filter(resource => {
          return (
            resource.name &&
            resource.content &&
            !existingResources.some(
              r => r.name === resource.name && r.content === resource.content,
            )
          );
        });

        const invalidResources = importedResources.filter(
          resource => !resource.name || !resource.content,
        );

        const duplicateResources = importedResources.filter(resource => {
          return (
            resource.name &&
            resource.content &&
            existingResources.some(
              r => r.name === resource.name && r.content === resource.content,
            )
          );
        });

        resources.value.push(...validResources);
        await saveResources();

        const successCount = validResources.length;
        const failureCount = invalidResources.length;
        const duplicateCount = duplicateResources.length;

        const failureReasons = invalidResources.map(resource => {
          if (!resource.name && !resource.content) {
            return '名称和内容均为空';
          } else if (!resource.name) {
            return '名称为空';
          } else {
            return '内容为空';
          }
        });

        const message = `
          导入结果:
          - 成功导入 ${successCount} 条资源
          - 失败导入 ${failureCount} 条资源
          - 失败原因: ${failureReasons.join(', ')}
          - 重复资源: ${duplicateCount} 条
        `;

        MessagePlugin.info(message);
      } catch (error) {
        MessagePlugin.error('导入资源失败，请检查文件格式');
      }
    }
  };
  input.click();
};

const handleRowClick = e => {
  console.log(e);
};

const handleSelectChange = selected => {
  selectedRows.value = selected;
};

watch(books, newBooks => {
  if (newBooks.length > 0 && !selectedBook.value) {
    selectedBook.value = newBooks[0];
    loadResources();
  }
});

onMounted(() => {
  loadResources();
});
</script>
