<template>
  <v-container>
    <v-layout class="mx-2">
      <v-flex
        v-if="!status"
        md5 xs12
        class="mt-4 mx-auto">
        <v-card>
          <v-card-title
            v-if="selfPayed"
            class="green text-xs-center justify-content-center register-title"
          >

            <div class="caption">
              <div>
                شما تا به حال {{this.$persianJS.englishNumber(30)}} هزار تومان از هزینه جشن خود را پرداخت کرده اید.
              </div>
              <div> حالا می توانید هزینه همراهان خود را در اینجا پرداخت کنید.</div>

            </div>

          </v-card-title>

          <v-card-text>

            <v-form ref="form" v-model="valid">
              <v-layout row class="align-items-center justify-content-center">
                <v-flex xs10
                        v-for="(item,index) in fields"
                        :key="index"
                        class="mx-2">
                  <v-text-field
                    v-if="item.type === 'text-field'"
                    :label="item.label"
                    :rules="item.rules"
                    v-model="item.value"
                    required/>
                  <v-text-field
                    v-if="item.type === 'number'"
                    :label="item.label"
                    v-model="item.value"
                    min="0"
                    type="number"/>


                </v-flex>

                <span class="title blue g-w-100 white--text pa-3 text-xs-center elevation-3">
                  <v-tooltip bottom>
                    <v-icon
                      slot="activator"
                      color="white"
                      light
                    >info</v-icon>
                      <div>هزینه به ازای هر دانشجو : {{this.$persianJS.englishNumber(45)}} هزار تومان</div>
                      <div>هزینه به ازای هر همراه : {{this.$persianJS.englishNumber(30)}} هزار تومان</div>
                  </v-tooltip>
                  <span>
                    هزینه ثبت نام:
                  </span>
                  <span style="font-size: 30px">
                   {{this.$persianJS.englishNumber(this.cost)}}
                  </span>

                  <span style="font-size: 9px;">
                    هزار تومان
                  </span>

                </span>

              </v-layout>

              <v-layout row class="align-items-center justify-content-center mt-3">

                <v-btn
                  :disabled="cost === 0"
                  class="success"
                  @click="submit">ثبت نام
                </v-btn>
              </v-layout>

            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex
        v-else
        class="mt-5 mx-auto justify-content-center"
        md4 xs12>
        <ticket
          :data="ticket"/>
        <div class="d-flex justify-content-center">
          <v-dialog
            v-model="dialog"
            width="500"
          >
            <!--<v-btn-->
              <!--slot="activator"-->
              <!--color="primary"-->
              <!--dark-->
              <!--block-->
            <!--&gt;-->
              <!--<v-icon>mdi-plus</v-icon>-->
              <!--اضافه کردن مهمان-->
            <!--</v-btn>-->

            <v-card>


              <v-card-text>
                <div class="d-flex align-items-center my-3">
                  <span>تعداد همراهان</span>
                  <span><input type="number" v-model="familyInDialog" :min="ticket.family"
                               class="ceit-add-family-input"></span>
                </div>

                <div class="d-flex justify-content-center align-items-center my-3">
                  <span>
                    هزینه ثبت نام:
                  </span>
                  <span>
                      <span style="font-size: 30px">
                        {{this.$persianJS.englishNumber((familyInDialog-ticket.family) * 30)}}
                      </span>

                    <span style="font-size: 9px;">
                      هزار تومان
                    </span>
                  </span>


                </div>

              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  :disabled="familyInDialog <= ticket.family"
                  @click="addFamily()"
                >
                  پرداخت
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Ticket from '@/components/Ticket.vue'

  export default {
    components: {
      Ticket
    },
    name: "Index",
    data() {
      return {
        familyInDialog: 0,
        dialog: false,
        selfPayed: '',
        valid: true,
        status: false,
        ticket: {},
        fields: [
          {
            label: 'ایمیل',
            slug: 'email',
            value: '',
            type: 'text-field',
            rules: [
              v => !!v || 'لطفا ایمیل خود را وارد کنید.',
              v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'آدرس ایمیل باید معتبر باشد.'
            ],
          },
          {
            label: 'شماره تلفن',
            slug: 'phone',
            value: '',
            type: 'text-field',
            rules: [
              v => !!v || 'لطفا شماره تلفن خود را وارد کنید.',
              v => /^(\+989|9|09)([0-9]{2})\d{7}$/.test(v) || 'شماره تلفن باید معتبر باشد.'
            ]
          },
          {
            label: 'تعداد افراد همراه',
            slug: 'family',
            value: 0,
            type: 'number'
          },
        ]
      }
    },
    created() {
      if (this.status)
        this.familyInDialog = this.ticket.family;
    },
    methods: {
      async submit() {
        if (this.$refs.form.validate()) {
          let form = {
            cost: this.cost
          };
          this.fields.forEach((e) => {
            form[e.slug] = e.value
          });
          try {
            let result = await this.$axios.post('/payment/pay', form);
            window.location = result.data.gateway.url

          } catch (e) {

          }

        }
      },
      async addFamily(){
        if(this.familyInDialog <= this.ticket.family){

        }else {
          try {
            let result = await this.$axios.post('/payment/add', {newFamily:this.familyInDialog});
            window.location = result.data.gateway.url

          } catch (e) {

          }
        }
      }
    },
    async asyncData(context) {
      let result = await context.$axios.get('/payment/status');
      return {status: result.data.status, ticket: result.data.ticket, selfPayed: result.data.selfPayed}
    },

    computed: {
      /**
       * Computes total cost for student and his/her family
       * @param val
       * @returns {number}
       */
      cost: function (val) {
        return (this.selfPayed ? 15 : 45) + (this.fields[2].value * 30);
      }
    },
  }
</script>

<style scoped>
  .register-title {
    color: white;
  }

  .ceit-add-family-input {
    background-color: lightgray;
    padding: 5px;
    width: 100%;
    border-radius: 3px;

  }
</style>
