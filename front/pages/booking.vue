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
        <v-btn fab text small @click="handlePrevClick">
          <v-icon small>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn fab text small @click="handleNextClick">
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
          :type="calendarType"
          :max-days="6"
          :weekdays="[1, 2, 3, 4, 5, 6]"
          @click:event="handleEventClick"
          @click:time="handleCalendarClick"
        />

        <!-- POP OVER -->
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
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
              <p v-if="selectedEvent.User && selectedEvent.User.displayName">
                <v-icon>mdi-account-box-outline</v-icon>
                {{ selectedEvent.User.displayName }}
              </p>
              <p v-if="selectedEvent.User && selectedEvent.User.email">
                <v-icon>mdi-email-outline</v-icon>
                <a :href="`mailto:${selectedEvent.User.email}`">
                  {{ selectedEvent.User.email }}
                </a>
              </p>
              <p v-if="selectedEvent.Asso">
                <v-icon>mdi-music-clef-treble</v-icon>
                {{ selectedEvent.Asso.name }}
              </p>
              <p>
                <v-icon>mdi-information-outline</v-icon>
                {{ selectedEvent.details }}
              </p>
              <p>
                <v-icon>mdi-calendar-outline</v-icon>
                {{ $moment(selectedEvent.start).format('LL') }}
              </p>
              <p>
                <v-icon>mdi-clock-outline</v-icon>
                {{ $moment(selectedEvent.start).format('HH:mm') }} →
                {{ $moment(selectedEvent.end).format('HH:mm') }}
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
      // Calendar
      focus: null, // Date at which the Calendar is set

      // Rooms
      rooms: [], // Contains rooms and all of their events
      selectedRooms: [], // Room currently displayed

      // For the Pop Over
      selectedEvent: {}, // The event corresponding to the clicked event
      selectedElement: null, // The element corresponding to the clicked event
      selectedOpen: false // Is the Pop Over menu open
    }
  },
  computed: {
    // Switch type accordingly to Vuetify responsive breakpoints
    calendarType() {
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

    // Return a flatten array with every events to display
    // The room Id and color are set on every event to ease display
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

  watch: {
    // Reload events if we pass from day view to week view
    calendarType() {
      this.fetchEvents()
    }
  },

  beforeMount() {
    this.setToday()
  },

  async mounted() {
    // Fetching all events for current week
    await this.fetchEvents()

    // By default, we select every room
    this.selectedRooms = this.rooms.map((r) => r.name)
  },

  methods: {
    // Fetch all events for the current week
    async fetchEvents() {
      let start, end

      // Displaying a week
      if (this.calendarType === 'week') {
        start = this.$moment(this.focus).startOf('week')
        end = this.$moment(start).add(5, 'day')
      }
      // Displaying one day
      else {
        end = start = this.$moment(this.focus)
      }

      this.rooms = (await this.$axios.get(
        `/rooms/${start.format('YYYY-MM-DD')}/${end.format('YYYY-MM-DD')}`
      )).data
    },
    handleEventClick({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = { ...event }
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 50)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 50)
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    // Display the event modifier for the selected event
    handleEditEventClick() {
      this.$refs.eventModifier.showModal(this.selectedEvent)
    },
    // Display the event modifier to create a new event
    handleCreateEventClick() {
      this.$refs.eventModifier.showModal(null)
    },
    // Display the event modifier with preset for the clicked day
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
    // Delete the event
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
    // Goes to previous day/week (depending on calendarType)
    async handlePrevClick() {
      const now = this.$moment(this.focus)

      // In case of day type, skip sundays
      if (this.calendarType === 'day') {
        now.subtract(1, 'd')
      } else {
        now.subtract(7, 'd')
      }

      // Skip Sundays
      if (now.day() === 0) {
        now.subtract(1, 'd')
      }

      // Update focus
      this.focus = now.format('YYYY-MM-DD')

      // Fetch event for the new view
      await this.fetchEvents()
    },
    // Goes to previous day/week (depending on calendarType)
    async handleNextClick() {
      const now = this.$moment(this.focus)

      // In case of day type, skip sundays
      if (this.calendarType === 'day') {
        now.add(1, 'd')
      } else {
        now.add(7, 'd')
      }

      // Skip Sundays
      if (now.day() === 0) {
        now.add(1, 'd')
      }

      // Update focus
      this.focus = now.format('YYYY-MM-DD')

      // Fetch event for the new view
      await this.fetchEvents()
    },

    // When an event is modified via EventModifier component, update components
    async handleEventModification() {
      await this.fetchEvents()
    },

    // Check if the user is owner of the event (or admin)
    isOwner(event) {
      return (
        event.User &&
        (event.User.id === this.$store.state.auth.user.id ||
          this.$store.state.auth.user.isAdmin)
      )
    },

    // Given an event, returns the name to display on the Calendar
    giveEventName(e) {
      const time = `${e.start.time} → ${e.end.time}`
      if (e.input.Asso) {
        return `${e.input.Asso.name} - ${time}`
      } else if (e.input.User.displayName) {
        return `${e.input.User.displayName} - ${time}`
      } else {
        return `Indiv. - ${time}`
      }
    },

    // Set date to Today
    setToday() {
      const now = this.$moment()
      if (now.day() === 0) {
        now.add(1, 'd')
      }
      this.focus = now.format('YYYY-MM-DD')
    }
  },
  head() {
    return {
      title: 'Réservations'
    }
  }
}
</script>
