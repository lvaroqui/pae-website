<template>
  <v-row no-gutters>
    <v-col>
      <!-- TOOLBAR -->
      <v-toolbar flat dense>
        <v-btn color="primary" outlined class="mr-4" @click="setToday">
          Aujourd'hui
        </v-btn>
        <v-btn fab text small @click="prev">
          <v-icon small>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn fab text small @click="next">
          <v-icon small>mdi-chevron-right</v-icon>
        </v-btn>
        <div class="flex-grow-1"></div>
        <v-btn
          fab
          color="primary"
          outlined
          small
          depressed
          @click="handleCreateEventClick"
        >
          <v-icon small>mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- CALENDAR -->
      <v-sheet>
        <v-calendar
          ref="calendar"
          v-model="focus"
          :short-weekdays="false"
          :first-interval="16"
          :interval-count="28"
          :interval-minutes="30"
          :interval-height="20"
          :interval-format="
            (interval) => {
              return interval.time
            }
          "
          :events="events"
          :event-name="giveEventName"
          :type="type"
          :max-days="6"
          :weekdays="[1, 2, 3, 4, 5, 6]"
          @change="updateRange"
          @click:event="showEvent"
          @click:time="handleCreateEventClick"
        >
        </v-calendar>

        <!-- POP OVER -->
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          full-width
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon @click="handleEditEventClick">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="handleDeleteEventClick">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title>{{ selectedEvent.asso }}</v-toolbar-title>
              <div class="flex-grow-1"></div>
              <v-btn icon @click="selectedOpen = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <p>
                <v-icon>mdi-calendar-outline</v-icon>
                {{ $moment(selectedEvent.start).format('LL') }}
              </p>
              <p>
                <v-icon>mdi-clock-outline</v-icon>
                {{ $moment(selectedEvent.start).format('HH:mm') }} →
                {{ $moment(selectedEvent.end).format('HH:mm') }}
              </p>
              <p>
                <v-icon>mdi-information-outline</v-icon>
                {{ selectedEvent.details }}
              </p>
              <p>
                <v-icon>mdi-account-box-outline</v-icon>
                {{ selectedEvent.ownerName }}
              </p>
              <p>
                <v-icon>mdi-email-outline</v-icon>
                <a :href="`mailto:${selectedEvent.ownerEmail}`">
                  {{ selectedEvent.ownerEmail }}
                </a>
              </p>
              <p>
                <v-icon>mdi-phone-outline</v-icon>
                <a :href="`tel:${selectedEvent.ownerPhone}`">
                  {{ selectedEvent.ownerPhone }}
                </a>
              </p>
            </v-card-text>
          </v-card>
        </v-menu>

        <!-- EDIT DIALOG -->
        <BaseEventModifier ref="eventModifier" @input="updateOrCreateEvent" />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import BaseEventModifier from '~/components/BaseEventModifier'

export default {
  name: 'Booking',
  components: { BaseEventModifier },
  data() {
    return {
      focus: null,
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [
        {
          id: 1,
          owner: 'lvaroqui',
          ownerName: 'Luc Varoqui',
          ownerEmail: 'luc.varoqui@etu.utc.fr',
          ownerPhone: '06.89.88.10.94',
          details: 'Répétition hebdomadaire',
          asso: 'Stravaganza',
          start: '2019-09-09 19:30',
          end: '2019-09-09 21:30'
        },
        {
          id: 2,
          owner: 'lvaroqui',
          ownerName: 'Luc Varoqui',
          ownerEmail: 'luc.varoqui@etu.utc.fr',
          ownerPhone: '06.89.88.10.94',
          details: 'Répétition hebdomadaire',
          start: '2019-09-10 19:30',
          end: '2019-09-10 21:30'
        }
      ]
    }
  },
  computed: {
    today() {
      return this.$moment().format('YYYY-MM-DD')
    },
    type() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 'day'
        case 'sm':
          return 'day'
        case 'md':
          return 'week'
        case 'lg':
          return 'week'
        case 'xl':
          return 'week'
        default:
          return 'week'
      }
    }
  },
  beforeMount() {
    this.setToday()
  },
  methods: {
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = { ...event }
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    handleEditEventClick() {
      this.$refs.eventModifier.showModal(this.selectedEvent)
    },
    handleCreateEventClick(day) {
      // Do not open Event Editor if menu is open
      if (this.selectedOpen) {
        return
      }

      let event = null
      if (day.date) {
        const now = this.$moment(`${day.date} ${day.time}`).startOf('h')
        event = {
          start: now.format('YYYY-MM-DD HH:mm'),
          end: now.add(30, 'm').format('YYYY-MM-DD HH:mm')
        }
      }
      this.$refs.eventModifier.showModal(event)
    },
    handleDeleteEventClick() {
      // TODO: API LINK DELETE
      this.events = this.events.filter((e) => e.id !== this.selectedEvent.id)
      this.selectedEvent = {}
      this.selectedElement = null
      this.selectedOpen = false
    },
    updateOrCreateEvent(event) {
      // Update
      if (event.id) {
        this.events = this.events.filter((e) => e.id !== event.id)
        this.events.push(event)
        // TODO: API LINK UPDATE
      }
      // Create
      else {
        event.id = this.events[this.events.length - 1].id + 1
        // TODO: API LINK DELETE
        this.events.push(event)
      }
    },
    giveEventName(e) {
      const name = e.input.asso ? e.input.asso : e.input.ownerName
      return `
      ${name} - 
      ${this.$moment(e.start).format('HH:mm')} →
      ${this.$moment(e.end).format('HH:mm')}
      `
    },
    prev() {
      if (this.type === 'day') {
        const now = this.$moment(this.focus)
        now.subtract(1, 'd')
        if (now.day() === 0) {
          now.subtract(1, 'd')
        }
        this.focus = now.format('YYYY-MM-DD')
      } else {
        this.$refs.calendar.prev()
      }
    },
    next() {
      if (this.type === 'day') {
        const now = this.$moment(this.focus)
        now.add(1, 'd')
        if (now.day() === 0) {
          now.add(1, 'd')
        }
        this.focus = now.format('YYYY-MM-DD')
      } else {
        this.$refs.calendar.next()
      }
    },
    setToday() {
      const now = this.$moment()
      if (now.day() === 0) {
        now.add(1, 'd')
      }
      this.focus = now.format('YYYY-MM-DD')
    },
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