<template>
  <div class="home">
    <a :href="SERVER_ADDRESS" target="_blank"><img alt="NetsBlox logo" src="/images/logo.png"></a>
    <p>Welcome to NetsBlox teacher dashboard.</p>
    <p style="color:red;font-weight:bold">Undergoing maintenance. Please be patient as we work on improving the system!</p>
    <p style="font-weight:bold">For urgent requests, please reach out to brian.broll@vanderbilt.edu</p>
    <p>Server address: <a :href="SERVER_ADDRESS" target="_blank">{{ SERVER_ADDRESS }}</a></p>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'home',
  components: {
  },
  data() {
    return {
      SERVER_ADDRESS: store.state.SERVER_ADDRESS,
    }
  }
}
</script>

<style scoped>
img {
  max-width: 10vw;
  max-height: 10vh;
}
</style>
