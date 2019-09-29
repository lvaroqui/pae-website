<template>
  <v-dialog v-model="edit" persistent width="500">
    <v-card>
      <v-card-title primary-title>
        Modification d'évènement
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-select
            v-model="roomId"
            :items="roomsList"
            prepend-icon="mdi-home"
            label="Salle"
            :rules="required"
          />
          <v-select
            v-if="assosList"
            v-model="assoId"
            :items="assosList"
            prepend-icon="mdi-music-clef-treble"
            label="Asso"
          />
          <v-text-field
            v-model="details"
            prepend-icon="mdi-information-outline"
            label="Détails"
            :rules="required"
          />
          <BaseDatePickerField v-model="date" label="Date" :rules="required" />
          <BaseTimePickerField
            v-model="startTime"
            min="08:00"
            max="21:00"
            :allowed-minutes="[0, 15, 30, 45]"
            label="Heure de début"
            :rules="required"
            @input="handleStartTimeInput"
          />
          <BaseTimePickerField
            v-model="endTime"
            :min="startTime"
            max="21:30"
            :allowed-minutes="[0, 15, 30, 45]"
            label="Heure de fin"
            :rules="required"
          />

          <div v-if="!eventId && $store.state.auth.user.isAdmin">
            <v-checkbox
              v-model="isRecurring"
              label="Répéter l'évènement"
            ></v-checkbox>
            <BaseDatePickerField
              v-if="isRecurring"
              v-model="until"
              label="Dernière répétition"
              :rules="required"
            />
          </div>
          <div class="red--text">
            <h3>{{ errorMessage }}</h3>
            <ul v-if="errors.length">
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="red" @click="close">Annuler</v-btn>
        <div class="flex-grow-1"></div>
        <v-btn :disabled="!valid" text color="green" @click="submit">
          Valider
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import BaseTimePickerField from '~/components/BaseTimePickerField'
import BaseDatePickerField from '~/components/BaseDatePickerField'

export default {
  name: 'BaseEventModifier',
  components: { BaseTimePickerField, BaseDatePickerField },
  props: {
    rooms: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      required: [(v) => !!v || 'Ce champ est nécessaire !'], // Verification rule
      valid: false, // Is the form valid ?
      edit: false, // Is the modal displayed ?
      errorMessage: '',
      errors: [], // List of errors returned by the API

      isRecurring: false, // Is the event recurring (admin only, creation only)

      // Edited event attributes values
      roomId: null,
      assoId: null,
      date: '',
      startTime: '',
      endTime: '',
      details: '',
      until: '',
      eventId: null
    }
  },
  computed: {
    // List of rooms passed by parent
    roomsList() {
      return this.rooms.map((r) => {
        return { value: r.id, text: r.name }
      })
    },

    // List of available assos based on current user
    assosList() {
      const list = this.$store.state.auth.user.assos
        .filter((a) => a.hasReservationRight)
        .map((a) => {
          return { value: a.id, text: a.name }
        })

      // If list is empty, no need to display the field
      if (list.length > 0) {
        list.unshift({ value: null, text: 'Aucune' })
        return list
      } else {
        return null
      }
    }
  },
  methods: {
    // Show the modal, called by parent
    showModal(event) {
      // If an event is passed, take it's values and convert it to match Pickers format
      if (event) {
        this.eventId = event.id
        this.date = this.$moment(event.start).format('YYYY-MM-DD')
        this.startTime = this.$moment(event.start).format('HH:mm')
        this.endTime = this.$moment(event.end).format('HH:mm')
        this.details = event.details
        this.roomId = event.roomId
        this.assoId = event.Asso ? event.Asso.id : null
      }
      this.edit = true
      this.$nextTick(() => {
        this.$refs.form.resetValidation()
      })
    },

    // Submit modifications to API
    submit() {
      // Reset errors
      this.errorMessage = ''
      this.errors = []

      const event = {
        roomId: this.roomId,
        assoId: this.assoId,
        start: this.$moment(`${this.date} ${this.startTime}`).toDate(),
        end: this.$moment(`${this.date} ${this.endTime}`).toDate(),
        details: this.details
      }

      if (this.isRecurring) {
        event.until = this.$moment(this.until).toDate()
      }

      const handleSuccess = () => {
        this.$emit('input')
        this.close()
      }

      const handleError = (error) => {
        this.errorMessage = error.response.data.message
        if (error.response.data.status === 'validationError') {
          this.errors = error.response.data.errors.map((e) => e.message)
        }
      }

      // PATCH : an eventId is set
      if (this.eventId) {
        this.$axios
          .patch(`/rooms/event/${this.eventId}`, event)
          .then(handleSuccess)
          .catch(handleError)
      }
      // POST : no eventId is set
      else {
        this.$axios
          .post('/rooms/event', event)
          .then(handleSuccess)
          .catch(handleError)
      }
    },
    // Close the modal
    close() {
      Object.assign(this.$data, this.$options.data())
    },
    // Function that updates endTime so that it is always after startTime
    handleStartTimeInput() {
      if (this.startTime >= this.endTime) {
        this.endTime = this.$moment
          .utc(this.startTime, 'HH:mm')
          .add(15, 'm')
          .format('HH:mm')
      }
    }
  }
}
</script>
