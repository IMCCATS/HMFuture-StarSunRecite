// store/index.js
import { defineStore } from 'pinia';

export const useBookStore = defineStore('main', {
  state: () => ({
    currentBook: null,
  }),
  actions: {
    setCurrentBook(book) {
      this.currentBook = book;
    },
  },
});
