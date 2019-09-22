<template>
  <div>
    <v-menu
      ref="datePicker"
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="formatedLocalDate"
          :label="label"
          prepend-icon="mdi-calendar-outline"
          readonly
          :rules="rules"
          v-on="on"
        />
      </template>
      <v-date-picker
        v-model="localDate"
        v-bind="$attrs"
        @click:date="$refs.datePicker.save(localDate)"
      />
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'BaseDatePickerField',
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
    localDate: {
      get() {
        return this.value
      },
      set(localDate) {
        this.$emit('input', localDate)
      }
    },
    formatedLocalDate() {
      if (this.localDate) {
        return this.$moment(this.localDate).format('LL')
      } else {
        return ''
      }
    }
  }
}
</script>
