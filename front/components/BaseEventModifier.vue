<template>
  <v-dialog v-model="edit" persistent width="500">
    <v-card>
      <v-card-title primary-title>
        Modification d'évènement
      </v-card-title>
      <v-card-text>
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
  data() {
    return {
      edit: false,
      date: '',
      startTime: '',
      endTime: '',
      details: '',
      localEvent: {}
    }
  },
  methods: {
    showModal(event) {
      if (event) {
        this.date = this.$moment(event.start).format('YYYY-MM-DD')
        this.startTime = this.$moment(event.start).format('HH:mm')
        this.endTime = this.$moment(event.end).format('HH:mm')
        this.details = event.details
        this.localEvent = event
      }
      this.edit = true
    },
    validate() {
      // Emit input event
      this.$emit('input', {
        ...this.localEvent,
        start: `${this.date} ${this.startTime}`,
        end: `${this.date} ${this.endTime}`,
        details: this.details
      })

      this.close()
    },
    close() {
      // Reset Local State
      this.date = ''
      this.startTime = ''
      this.endTime = ''
      this.details = ''
      this.localEvent = {}

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
