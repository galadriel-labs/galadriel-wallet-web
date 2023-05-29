<template>
  <div id="app">
    <GaladrielHeader />
    <router-view ></router-view>
    <!-- <GaladrielFooter /> -->
  </div>
</template>

<script>
import GaladrielHeader from '@/components/Header'
import GaladrielFooter from '@/components/Footer'
export default {
  name: 'App',
  components: {
        GaladrielHeader,
        GaladrielFooter
    },
}
</script>
