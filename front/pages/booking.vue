<template>
  <v-row no-gutters>
    <v-col>
      <!-- TOOLBAR -->
      <v-toolbar class="mt-2" flat dense>
        <v-checkbox
          v-for="room in rooms"
          :key="room.name"
          v-model="selectedRooms"
          :label="room.name"
          :value="room.name"
          :color="room.color"
          class="mr-2"
        ></v-checkbox>
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
      <!-- TOOLBAR -->
      <v-toolbar flat dense>
        <v-btn
          color="primary"
          outlined
          class="mr-4"
          @click="
            setToday()
            fetchEvents()
          "
        >
          Aujourd'hui
        </v-btn>
        <v-btn fab text small @click="prev">
          <v-icon small>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn fab text small @click="next">
          <v-icon small>mdi-chevron-right</v-icon>
        </v-btn>
        <div style="text-transform: capitalize">
          {{ $moment(focus).format('MMMM YYYY') }}
        </div>
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
          :events="calendarEvents"
          :event-name="giveEventName"
          :event-color="(e) => e.color"
          :type="type"
          :max-days="6"
          :weekdays="[1, 2, 3, 4, 5, 6]"
          @change="updateRange"
          @click:event="showEvent"
          @click:time="handleCalendarClick"
        />

        <!-- POP OVER -->
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            v-if="selectedOpen"
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn
                v-if="isOwner(selectedEvent)"
                icon
                @click="handleEditEventClick"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                v-if="isOwner(selectedEvent)"
                icon
                @click="handleDeleteEventClick"
              >
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
              <p v-if="selectedEvent.User">
                <v-icon>mdi-account-box-outline</v-icon>
                {{ selectedEvent.User.displayName }}
              </p>
              <p v-if="selectedEvent.User">
                <v-icon>mdi-email-outline</v-icon>
                <a :href="`mailto:${selectedEvent.User.email}`">
                  {{ selectedEvent.User.email }}
                </a>
              </p>
            </v-card-text>
          </v-card>
        </v-menu>

        <!-- EDIT DIALOG -->
        <BaseEventModifier
          ref="eventModifier"
          :rooms="
            rooms.map((r) => {
              return { id: r.id, name: r.name }
            })
          "
          @input="handleEventModification"
        />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import BaseEventModifier from '~/components/BaseEventModifier'

export default {
  name: 'Booking',
  components: { BaseEventModifier },
  middleware: ['authRequired'],
  data() {
    return {
      focus: null,
      start: null,
      end: null,
      selectedRooms: [],
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      rooms: []
    }
  },
  computed: {
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
    },
    calendarEvents() {
      let events = []
      this.rooms.forEach((room) => {
        if (this.selectedRooms.find((r) => r === room.name)) {
          events = events.concat(
            room.Events.map((event) => {
              return { ...event, color: room.color, roomId: room.id }
            })
          )
        }
      })
      return events
    }
  },
  async mounted() {
    // Fetching all events for current week
    await this.fetchEvents()

    // By default, we select every room
    this.selectedRooms = this.rooms.map((r) => r.name)
  },
  beforeMount() {
    this.setToday()
  },
  methods: {
    async fetchEvents() {
      this.rooms = (await this.$axios.get(`/rooms/${this.focus}`)).data
    },
    isOwner(event) {
      return event.User.id === this.$store.state.auth.user.id
    },
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
    handleCreateEventClick() {
      this.$refs.eventModifier.showModal(null)
    },
    handleCalendarClick(day) {
      if (!this.selectedOpen) {
        const now = this.$moment(`${day.date} ${day.time}`).startOf('h')
        const event = {
          start: now.format('YYYY-MM-DD HH:mm'),
          end: now.add(30, 'm').format('YYYY-MM-DD HH:mm')
        }
        this.$refs.eventModifier.showModal(event)
      }
    },
    handleDeleteEventClick() {
      this.$axios
        .delete(`/rooms/event/${this.selectedEvent.id}`)
        .then((res) => {
          this.fetchEvents()
          this.selectedEvent = {}
          this.selectedElement = null
          this.selectedOpen = false
        })
    },
    async handleEventModification() {
      await this.fetchEvents()
    },
    giveEventName(e) {
      const name = e.input.Asso ? e.input.Asso.name : e.input.User.displayName
      return `
      ${name} -
      ${this.$moment(e.start).format('HH:mm')} →
      ${this.$moment(e.end).format('HH:mm')}
      `
    },
    async prev() {
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
      await this.fetchEvents()
    },
    async next() {
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
      await this.fetchEvents()
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
