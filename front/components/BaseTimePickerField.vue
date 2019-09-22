<template>
  <div>
    <v-menu
      ref="timePicker"
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
      @input="
        (value) => value && $refs.picker && ($refs.picker.selectingHour = true)
      "
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="localTime"
          :label="label"
          prepend-icon="mdi-clock-outline"
          readonly
          :rules="rules"
          v-on="on"
        ></v-text-field>
      </template>
      <v-time-picker
        ref="picker"
        v-model="localTime"
        v-bind="$attrs"
        format="24hr"
        full-width
        @click:minute="$refs.timePicker.save(localTime)"
      ></v-time-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'BaseTimePickerField',
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    rules: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      menu: false
    }
  },
  computed: {
    localTime: {
      get() {
        return this.value
      },
      set(localTime) {
        this.$emit('input', localTime)
      }
    }
  }
}
</script>
