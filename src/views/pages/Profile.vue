<template>
    <IonPage>
      <ion-content >
        <div class="pa-3" style="height: 80vh; overflow-y: auto;">
          <ion-card color="dark" class="pa-4" style="border-radius: 25px;">
            <img  src="/user.png"
            class="d-flex justify-center profile" style="width: 17vh; height: 17vh; margin: auto; border-radius: 50%;"/>
            <h3 class="d-flex justify-center pt-2"  style="font-size: 2.5vh;">{{ session_user.employeeNo  }}</h3>
            <h3 class="d-flex justify-center"  style="font-size: 2.3vh;">{{ session_user.fullName }} </h3>
          </ion-card>
          <div class="pa-2">
            <h3 class="text-center py-2" style="font-size: 2.6vh;">EMPLOYMENT INFORMATION</h3>
            <h3  style="font-size: 2.5vh;">Company:</h3>
            <h4 class="pb-2"  style="font-size: 2.2vh; color: #303030">{{ session_user.company  }}</h4>
            <h3 style="font-size: 2.5vh;">Department:</h3>
            <h4 class="pb-2" style="font-size: 2.2vh; color: #303030">{{ session_user.department  }}</h4>
            <h3 style="font-size: 2.5vh;">Position:</h3>
            <h4 class="pb-2" style="font-size: 2.2vh; color: #303030">{{ session_user.position  }}</h4>
            <h3 style="font-size: 2.5vh;">Shift Schedule:</h3>
            <h4 class="pb-2" style="font-size: 2.2vh; color: #303030">{{ session_user.shiftDesc }}</h4>
          </div>
        </div>

        <div style="position: absolute; bottom: 0px; left: 0px; transform: translate(0%, 0%); width:100%;">
          <ion-button id="open-pass"
           expand="full" class="main pa-3 pb-4" shape="round"  style="color: white; font-weight: 600;">Change Password</ion-button>
          <ion-modal id="example-modal" ref="modal" trigger="open-pass">
            <div class="wrapper">
              <h3 class="d-flex justify-center pt-2">Change Password</h3>
              <div class="pa-3">
                <IonInput v-model="password.old" type="password" label="Old Password" fill="outline" 
                  placeholder="Enter password" label-placement="stacked" 
                  style="text-align: left !important" class="custom pb-3">
                  <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                </IonInput>
                <IonInput v-model="password.new" type="password" label="New Password" fill="outline" 
                  placeholder="Enter new password" label-placement="stacked" 
                  style="text-align: left !important" class="custom pb-3">
                  <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                </IonInput>
                <IonInput v-model="password.confirm" type="password" label="Confirm Password" fill="outline" 
                  placeholder="Retype password" label-placement="stacked" 
                  style="text-align: left !important" class="custom pb-3">
                  <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                </IonInput>
                <ion-button expand="full" shape="round" color="primary" @click="confirmPass()">Confirm</ion-button>
              </div>
            </div>
          </ion-modal>
        </div>
      </ion-content>
    </IonPage>

</template>

<script>
import { IonPage,IonImg,IonCard,IonButton,IonContent,IonModal,IonInputPasswordToggle,IonInput,alertController 
} from '@ionic/vue';
import md5 from 'md5';
import MD5 from 'md5';

export default {
    components: { IonPage,IonImg,IonCard,IonButton,IonContent,IonModal,IonInputPasswordToggle,IonInput,alertController },
    data(){
        return{
            app_config:{},
            session_user:{},
             password: {
                old: '',
                new: '',
                confirm: ''
            }
        }
    },
    async created(){
        this.session_user = await this.$function.getUser()
        if(!this.session_user){
            this.$router.push('/')
        }
    },
    methods: {
        async confirmPass(){
            if(this.password.old == '' || this.password.new == '' || this.password.confirm == ''){
                this.$function.showAlert({ header: 'Warning', message: 'All fields are required', })
                return
            }
            if(MD5(this.password.old) != (this.session_user.password)){
                this.$function.showAlert({ header: 'Warning', message: 'Incorrect old password', })
                return
            }
            if(this.password.new != this.password.confirm){
                this.$function.showAlert({ header: 'Warning', message: 'Password does not match', })
                return
            }
            
            const result = await this.changepass()
            if(result.error == 0){
            this.$function.showAlert({ header: 'Success', message: 'Password changed successfully', })
            this.session_user.password = MD5(this.password.new)
            await this.$storage.setItem('session-user', (this.session_user))
            this.session_user =  await this.$function.getUser()
            this.password = {}
            }else{
                this.$function.showAlert({ header: 'Warning', message: 'Something went wrong. Please try again later.', })
            }
            this.$refs.modal.$el.dismiss()
        },
        async changepass(){
            try {
                let res = await this.$api.savedata({
                    tableName: 'users',
                    fields: {
                        ID: this.session_user.ID,
                        password: MD5(this.password.new)
                    },
                    key:['ID']
                })
                return res
            } catch (error) {
                console.log(error)
                return error
            }
        }
    }
}
</script>


<style scoped>
.profile img{
  display: flex;
  border-radius: 50% !important;
}
ion-modal#example-modal {
    --width: fit-content;
    --min-width: 250px;
    --height: fit-content;
    --border-radius: 6px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
  }

  ion-modal#example-modal h1 {
    margin: 20px 20px 10px 20px;
  }

  ion-modal#example-modal ion-icon {
    margin-right: 6px;

    width: 48px;
    height: 48px;

    padding: 4px 0;

    color: #aaaaaa;
  }

  ion-modal#example-modal .wrapper {
    margin-bottom: 10px;
  }
  ion-modal#example-modal .wrapper div{
    max-height: 70vh;
    overflow-y: scroll;
  }
</style>