<template>
  <v-row no-gutters>
    <v-col>
      <v-toolbar flat dense>
        <v-btn @click="$refs.calendar.prev()">Prev</v-btn>
        <v-btn @click="$refs.calendar.next()">Next</v-btn>
      </v-toolbar>
      <v-sheet min-width="100%">
        <v-calendar
          ref="calendar"
          v-model="focus"
          locale="fr"
          :events="events"
          type="week"
          :max-days="6"
          :weekdays="[1, 2, 3, 4, 5, 6]"
          @change="updateRange"
        >
        </v-calendar>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Booking',
  data() {
    return {
      focus: null,
      start: null,
      end: null,
      events: [
        {
          name: 'Weekly Meeting',
          start: '2019-09-07 09:00',
          end: '2019-09-07 10:00'
        }
      ]
    }
  },
  methods: {
    updateRange({ start, end }) {
      this.start = start
      this.end = end
    }
  },
  head() {
    return {
      title: 'Réservations'
    }
  }
}
</script>
