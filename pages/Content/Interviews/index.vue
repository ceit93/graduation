<template>
  <v-card class="justify-content-center justify-center">
    <v-card-actions class="justify-content-center">
      <v-flex xs12 md6>
        <v-btn large block dark color="info" append to="new" nuxt>
          <v-icon>note_add</v-icon>&nbsp;
          کوتاه‌سوال جدید پیشنهاد کنید
        </v-btn>
      </v-flex>
    </v-card-actions>
    <v-card-title class="justify-content-center">
      <h3>کوتاه‌پاسخ‌های شما</h3>
    </v-card-title>
    <v-card-actions class="justify-content-center">
      <v-btn
        :disabled="!valid"
        @click="submit"
        class="info"
      >
        <v-icon>mdi-file-delimited</v-icon>
        ذخیره کوتاه‌پاسخ‌ها
      </v-btn>
      <v-dialog v-model="dialog">
        <v-chip color="info" outline dark slot="activator" @click.native.stop="dialog = true" small>راهنمایی (؟)</v-chip>
        <v-card>
          <v-card-text>
            <h3>اولین چیزی که به ذهنت میرسه چیه؟</h3>
            <p>
              جواب هر سوال رو در کوتاه‌ترین حالت ممکن بدید.
            </p>
            <p>
              هر زمانی که خواستید میتونید از این صفحه خارج شید و بعدا برگردید به سراغ کوتاه‌پاسخ‌هاتون و اون‌هارو رو ویرایش کنید.
            </p>
          </v-card-text>
          <v-card-actions class="d-flex justify-content-center">
            <v-btn color="info" large @click.native="dialog = false">باشه</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
    <interviews :interviews="this.interviews" :per-page="10"></interviews>
    <v-card-actions class="justify-content-center">
      <v-btn
        :disabled="!valid"
        @click="submit"
        class="info"
      >
        <v-icon>mdi-file-delimited</v-icon>
        ذخیره کوتاه‌پاسخ‌ها
      </v-btn>
      <v-dialog v-model="dialog">
        <v-chip color="info" outline dark slot="activator" @click.native.stop="dialog = true" small>راهنمایی (؟)</v-chip>
        <v-card>
          <v-card-text>
            <h3>اولین چیزی که به ذهنت میرسه چیه؟</h3>
            <p>
              جواب هر سوال رو در کوتاه‌ترین حالت ممکن بدید.
            </p>
            <p>
              هر زمانی که خواستید میتونید از این صفحه خارج شید و بعدا برگردید به سراغ کوتاه‌پاسخ‌هاتون و اون‌هارو رو ویرایش کنید.
            </p>
          </v-card-text>
          <v-card-actions class="d-flex justify-content-center">
            <v-btn color="info" large @click.native="dialog = false">باشه</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Tarins from "~/components/Content/Tarins/Tarins";
  import Interviews from "../../../components/Content/Interviews";
  export default {
    name: "Index",
    components: {Interviews},
    layout: 'content',
    data(){
      return {
        dialog: false,
        valid: true
      }
    },
    notifications: {
      showSuccess: {
        title: 'کوتاه‌پاسخ‌های شما ذخیره شدند.',
        type: 'success'
      },
      showError: {
        title: 'خطایی رخ داد...',
        type: 'error'
      }
    },
    async asyncData (context) {
      let interviews = await context.$axios.get('/interviews')
        .then((res) => {
          return res.data.interviews
        }).catch(e => {
          context.error({statusCode: 500, message: 'خطای سرور...'})
        })
      let questions = await context.$axios.get('/questions')
        .then((res) => {
          return res.data.questions
        }).catch(e => {
          context.error({statusCode: 500, message: 'خطای سرور...'})
        })
      let temp = questions.map(x => {
        return {question: x, answer: ''}
      })
      interviews = temp.map(x => Object.assign(x, interviews.find(interview => interview.question._id === x.question._id)))
      return {
        interviews: interviews,
        questions: questions,
      }

    },
    methods: {
      submit() {
        this.$axios.post('/interviews', {
          interviews: this.interviews
        }).then(e => {
          this.showSuccess()
        }).catch(e => {
          this.showError()
        })
      }
    }
  }
</script>

<style scoped>
</style>
