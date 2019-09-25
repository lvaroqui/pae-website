<template>
  <v-layout></v-layout>
</template>

<script>
export default {
  name: 'Admin',
  middleware: ['authRequired'],
  head() {
    return {
      title: 'Admin'
    }
  }
}
</script>
