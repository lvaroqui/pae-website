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
          <div class="red--text">
            <p v-for="error in errors" :key="error">{{ error }}</p>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="red" @click="close">Annuler</v-btn>
        <div class="flex-grow-1"></div>
        <v-btn :disabled="!valid" text color="green" @click="validate">
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
      required: [(v) => !!v || 'Ce champ est nécessaire !'],
      valid: false,
      edit: false,
      roomId: null,
      assoId: null,
      date: '',
      startTime: '',
      endTime: '',
      details: '',
      eventId: null,
      errors: []
    }
  },
  computed: {
    roomsList() {
      return this.rooms.map((r) => {
        return { value: r.id, text: r.name }
      })
    },
    assosList() {
      const list = this.$store.state.auth.user.assos.map((a) => {
        return { value: a.id, text: a.name }
      })
      list.unshift({ value: null, text: 'Aucune' })
      return list
    }
  },
  methods: {
    showModal(event) {
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
    validate() {
      const event = {
        roomId: this.roomId,
        assoId: this.assoId,
        start: this.$moment(`${this.date} ${this.startTime}`).toDate(),
        end: this.$moment(`${this.date} ${this.endTime}`).toDate(),
        details: this.details
      }

      // PATCH
      if (this.eventId) {
        this.$axios
          .patch(`/rooms/event/${this.eventId}`, event)
          .then(() => {
            this.$emit('input')
            this.close()
          })
          .catch((err) => {
            this.errors = err.response.data.map((e) => e.message)
          })
      }
      // POST
      else {
        this.$axios
          .post('/rooms/event', event)
          .then(() => {
            this.$emit('input')
            this.close()
          })
          .catch((err) => {
            this.errors = err.response.data.map((e) => e.message)
          })
      }
    },
    close() {
      // Hide Modal
      this.edit = false

      // Reset Local State
      this.eventId = null
      this.roomId = null
      this.assoId = null
      this.date = ''
      this.startTime = ''
      this.endTime = ''
      this.details = ''
      this.errors = []
    },
    handleStartTimeInput() {
      if (this.startTime > this.endTime) {
        this.endTime = this.$moment
          .utc(this.startTime, 'HH:mm')
          .add(15, 'm')
          .format('HH:mm')
      }
    }
  }
}
</script>
