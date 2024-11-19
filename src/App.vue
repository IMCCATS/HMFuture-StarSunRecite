<script setup>
import { RouterView, useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';

const selectedMenuItem = ref('dashboard');

const route = useRoute();

function updateSelectedMenuItem(path) {
  switch (path) {
    case '/':
      selectedMenuItem.value = 'dashboard';
      break;
    case '/orgRes':
      selectedMenuItem.value = 'resource';
      break;
    case '/about':
      selectedMenuItem.value = 'about';
      break;
    case '/orgBook':
      selectedMenuItem.value = 'book';
      break;
    case '/lineRecite':
      selectedMenuItem.value = 'lineRecite';
      break;
    case '/randomRecite':
      selectedMenuItem.value = 'randomRecite';
      break;
    case '/extractWordRecite':
      selectedMenuItem.value = 'extractWordRecite';
      break;
    // 其他路径的处理
    default:
      selectedMenuItem.value = 'dashboard';
  }
}

onMounted(() => {
  updateSelectedMenuItem(route.path);
});

watch(route, newRoute => {
  updateSelectedMenuItem(newRoute.path);
});
</script>

<template>
  <t-config-provider :locale="zhConfig">
    <t-layout>
      <t-aside>
        <t-menu
          theme="light"
          :value="selectedMenuItem"
          style="margin-right: 50px"
          height="550px"
        >
          <template #logo>
            <img
              width="180"
              class="logo"
              src="@/assets/HMFuture-StarSunRecite-Logo.png"
              alt="logo"
            />
          </template>
          <t-menu-item value="dashboard" to="/">
            <template #icon>
              <t-icon name="dashboard" />
            </template>
            首页
          </t-menu-item>
          <t-menu-item value="book" to="/orgBook">
            <template #icon>
              <t-icon name="book" />
            </template>
            书籍管理
          </t-menu-item>
          <t-menu-item value="resource" to="/orgRes">
            <template #icon>
              <t-icon name="server" />
            </template>
            资源管理
          </t-menu-item>
          <t-menu-item value="lineRecite" to="/lineRecite">
            <template #icon>
              <t-icon name="root-list" />
            </template>
            顺次背诵
          </t-menu-item>
          <t-menu-item value="randomRecite" to="/randomRecite">
            <template #icon>
              <t-icon name="control-platform" />
            </template>
            随机背诵
          </t-menu-item>
          <t-menu-item value="extractWordRecite" to="/extractWordRecite">
            <template #icon>
              <t-icon name="precise-monitor" />
            </template>
            抽词背诵
          </t-menu-item>
          <!--          <t-menu-item value="mail">-->
          <!--            <template #icon>-->
          <!--              <t-icon name="mail" />-->
          <!--            </template>-->
          <!--            全部消息-->
          <!--          </t-menu-item>-->
          <!--          <t-menu-item value="user-circle">-->
          <!--            <template #icon>-->
          <!--              <t-icon name="user-circle" />-->
          <!--            </template>-->
          <!--            个人中心-->
          <!--          </t-menu-item>-->
          <!--          <t-menu-item value="play-circle">-->
          <!--            <template #icon>-->
          <!--              <t-icon name="play-circle" />-->
          <!--            </template>-->
          <!--            视频资源-->
          <!--          </t-menu-item>-->
          <t-menu-item value="about" to="about">
            <template #icon>
              <t-icon name="pending" />
            </template>
            关于应用
          </t-menu-item>
        </t-menu>
      </t-aside>
      <t-layout>
        <t-content style="max-height: 88vh; overflow-y: auto; padding: 10px">
          <RouterView />
        </t-content>
      </t-layout>
    </t-layout>
  </t-config-provider>
</template>
