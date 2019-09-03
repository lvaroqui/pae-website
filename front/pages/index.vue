<template>
  <v-layout>
    <p>{{ helloWorld }}</p>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      helloWorld: ''
    }
  },
  async mounted() {
    const { data } = await this.$axios.$get('/')
    this.helloWorld = data
  }
}
</script>
