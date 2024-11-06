<template>
  <main>
    <t-space style="width: 100%" direction="vertical">
      <t-card title="书籍管理">
        <t-space style="margin-bottom: 16px">
          <t-button @click="addBook">新增书籍</t-button>
        </t-space>
        <t-table
          row-key="id"
          :data="books"
          :columns="bookColumns"
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
          @select-change="handleSelectChange"
        >
          <template #action="{ row }">
            <t-space>
              <t-button size="small" @click="selectBook(row)"
                >选中当前书籍
              </t-button>
              <t-button size="small" @click="editBook(row)">编辑</t-button>
              <t-button size="small" @click="deleteBook(row)">删除</t-button>
            </t-space>
          </template>
        </t-table>
      </t-card>
    </t-space>

    <!-- 新增书籍模态框 -->
    <AddBook
      v-if="isAddingBook"
      :new-book="newBook"
      @close="closeAddBook"
      @submit="submitAddBook"
    />

    <!-- 编辑书籍模态框 -->
    <EditBook
      v-if="isEditingBook"
      :book="editingBook"
      @close="closeEditBook"
      @submit="submitEditBook"
    />
  </main>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import AddBook from '@/components/AddBook.vue';
import EditBook from '@/components/EditBook.vue';
import { useBookStore } from '@/stores/book';

const store = useBookStore();

const books = ref([]);
const selectedRows = ref([]);
const isAddingBook = ref(false);
const isEditingBook = ref(false);
const newBook = reactive({ name: '' });
const editingBook = ref(null);

const selectBook = row => {
  store.setCurrentBook(row);
  MessagePlugin.success('已选中书籍:' + row.name);
};

const bookColumns = ref([
  { colKey: 'id', title: 'ID', width: '100' },
  { colKey: 'name', title: '名称', width: '200' },
  { colKey: 'action', title: '操作', align: 'center', width: '200' },
]);

const pagination = {
  defaultCurrent: 1,
  defaultPageSize: 5,
  total: 0,
};

const loadBooks = () => {
  const savedBooks = localStorage.getItem('books');
  if (savedBooks) {
    books.value = JSON.parse(savedBooks);
  }
  pagination.total = books.value.length;
};

const saveBooks = () => {
  setTimeout(() => {
    store.$reset();
    localStorage.setItem('books', JSON.stringify(books.value));
    MessagePlugin.success('书籍已更新');
    loadBooks();
  }, 500);
};

const loadResources = () => {
  const savedResources = localStorage.getItem('resources');
  if (savedResources) {
    return JSON.parse(savedResources);
  }
  return [];
};

const saveResources = resources => {
  setTimeout(() => {
    localStorage.setItem('resources', JSON.stringify(resources));
    MessagePlugin.success('资源已更新');
  }, 500);
};

const addBook = () => {
  isAddingBook.value = true;
};

const closeAddBook = () => {
  isAddingBook.value = false;
  newBook.name = '';
};

const submitAddBook = () => {
  if (!newBook.name) {
    MessagePlugin.warning('请填写完整内容');
    return;
  }
  const newId =
    books.value.length > 0 ? books.value[books.value.length - 1].id + 1 : 1;
  const book = {
    id: newId,
    name: newBook.name,
  };
  books.value.push(book);
  saveBooks();
  closeAddBook();
};

const editBook = row => {
  isEditingBook.value = true;
  editingBook.value = { ...row };
};

const closeEditBook = () => {
  isEditingBook.value = false;
  editingBook.value = null;
};

const submitEditBook = () => {
  if (!editingBook.value.name) {
    MessagePlugin.warning('请填写完整内容');
    return;
  }
  const index = books.value.findIndex(b => b.id === editingBook.value.id);
  if (index !== -1) {
    books.value[index] = editingBook.value;
    saveBooks();
  }
  closeEditBook();
};

const deleteBook = row => {
  const confirmDia = DialogPlugin({
    header: '删除书籍',
    body: '确定要删除此书籍吗？将同时删除其中的全部资源。',
    confirmBtn: '确定',
    cancelBtn: '取消',
    onConfirm: ({ e }) => {
      const index = books.value.findIndex(b => b.id === row.id);
      if (index !== -1) {
        books.value.splice(index, 1);
        const resources = loadResources();
        const updatedResources = resources.filter(r => r.bookId !== row.id);
        saveResources(updatedResources);
        saveBooks();
      }
      confirmDia.hide();
    },
    onClose: ({ e, trigger }) => {
      confirmDia.hide();
    },
  });
};

const deleteSelectedBooks = () => {
  const confirmDia = DialogPlugin({
    header: '删除选中的书籍',
    body: '确定要删除选中的书籍吗？将同时删除其中的全部资源。',
    confirmBtn: '确定',
    cancelBtn: '取消',
    onConfirm: ({ e }) => {
      const idsToDelete = selectedRows.value.map(row => row.id);
      books.value = books.value.filter(row => !idsToDelete.includes(row.id));
      const resources = loadResources();
      const updatedResources = resources.filter(
        r => !idsToDelete.includes(r.bookId),
      );
      saveResources(updatedResources);
      saveBooks();
      confirmDia.hide();
    },
    onClose: ({ e, trigger }) => {
      confirmDia.hide();
    },
  });
};

const handleSelectChange = selected => {
  selectedRows.value = selected;
};

onMounted(() => {
  loadBooks();
});
</script>
