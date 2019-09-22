<template>
  <v-dialog v-model="edit" persistent width="500">
    <v-card>
      <v-card-title primary-title>
        Modification d'évènement
      </v-card-title>
      <v-card-text>
        <v-select
          v-model="room"
          :items="roomsList"
          prepend-icon="mdi-home"
          label="Salle"
        />
        <v-text-field
          v-model="details"
          prepend-icon="mdi-information-outline"
          label="Détails"
        />
        <BaseDatePickerField v-model="date" label="Date" />
        <BaseTimePickerField
          v-model="startTime"
          min="08:00"
          max="21:00"
          :allowed-minutes="[0, 15, 30, 45]"
          label="Heure de début"
          @input="handleStartTimeInput"
        />
        <BaseTimePickerField
          v-model="endTime"
          :min="startTime"
          max="21:30"
          :allowed-minutes="[0, 15, 30, 45]"
          label="Heure de fin"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn text color="red" @click="close">Annuler</v-btn>
        <div class="flex-grow-1"></div>
        <v-btn text color="green" @click="validate">Valider</v-btn>
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
      edit: false,
      room: null,
      date: '',
      startTime: '',
      endTime: '',
      details: '',
      eventId: null
    }
  },
  computed: {
    roomsList() {
      return this.rooms.map((r) => {
        return { value: r.id, text: r.name }
      })
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
        this.room = event.room
      }
      this.edit = true
    },
    validate() {
      const event = {
        roomId: this.room,
        start: this.$moment(`${this.date} ${this.startTime}`).toDate(),
        end: this.$moment(`${this.date} ${this.endTime}`).toDate(),
        details: this.details
      }

      // PATCH
      if (this.eventId) {
        this.$axios.patch(`/rooms/event/${this.eventId}`, event).then(() => {
          this.$emit('input')
          this.close()
        })
      }
      // POST
      else {
        this.$axios.post('/rooms/event', event).then(() => {
          this.$emit('input')
          this.close()
        })
      }
    },
    close() {
      // Reset Local State
      this.eventId = null
      this.room = null
      this.date = ''
      this.startTime = ''
      this.endTime = ''
      this.details = ''

      // Hide Modal
      this.edit = false
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
