<template>
  <div class="w-full min-h-screen bg-zinc-950 p-4">
    <div class="
        container mx-auto
        grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4
        auto-cols-auto transition-all duration-700 delay-75
      ">
      <template v-for="(data) in cardData" :key="data?.id">
        <router-link :to="data!.link">
          <div
            v-if="data !== null"
            class="
            cursor-pointer
            transition duration-300
            rounded-md bg-zinc-900 hover:bg-zinc-800 p-4 flex flex-col gap-4 w-full sm:max-w-[300px] sm:mx-auto"
            >
            <img :src="`/img/${data.id}.png`" class="w-full h-52 object-cover mx-auto aspect-square rounded"/>
            <p class="text-xl text-white text-center">{{data.title}}</p>
          </div>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue';
import {routes} from '../router';
import {RouterLink} from 'vue-router';

const cardData = computed(() => {
  return routes.map((route, idx) => {
    if (idx === 0){
      return null;
    }
    const id = route.name;
    const title = route.meta?.title;
    const link = route.path;
    const component = defineAsyncComponent(route.component);
    return { title,component, id,link}
  })
  .filter((v) => v);
})
</script>