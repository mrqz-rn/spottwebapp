<template>
  <ion-page class="backdrop">
      <IonLabel style="color: white; font-size: 13px;" class="pa-2"> Version: 1.2 3 </IonLabel>
        <div id="container" class="pa-6" style="margin-top: -10%">
          <div>
            <img style="height: 15vh; margin: auto;" src="/icon.png"/>
            <IonCardTitle class="pb-5" style="color: white; font-weight: 600; padding: 4vh">STERLING PAPER GROUP ONLINE TIME TRACKER</IonCardTitle>
            <IonInput v-model="user_input.username" 
              label="Username" fill="outline"  label-placement="stacked" 
              placeholder="Enter Username" style="text-align: left !important" 
              class="pb-3 custom">
            </IonInput>
            <IonInput v-model="user_input.password" type="password" label="Password" fill="outline" 
              placeholder="Enter Password" label-placement="stacked" 
              style="text-align: left !important" class="custom">
              <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
            </IonInput>
            <div class="d-flex justify-start py-2 px-1">
              <ion-checkbox v-model="user_input.remember" label-placement="end"><span style="color: white;">Remember me</span></ion-checkbox>
            </div>
            <IonButton  @click="login()" class="mt-4" expand="full" shape="round" size="large">LOG IN</IonButton>
          </div>
        </div>
    </ion-page>
</template>

<script>
import MD5 from 'md5';
import { IonPage,IonButton,IonInput,IonCardTitle,IonLabel,IonInputPasswordToggle,IonCheckbox,IonBackdrop,
    alertController,loadingController } from '@ionic/vue';
export default {
    components: {
        IonPage,IonButton,IonInput,IonCardTitle,IonLabel,IonInputPasswordToggle,IonCheckbox,IonBackdrop,
        alertController,loadingController
    },
    data(){
        return{
            user_input: {
                username: '',
                password: '',
                remember: false,
            },
            device: '',
            log_response: {}
        }
    },
    async created(){
        let model = await this.$function.getDeviceInfo()
        this.device = `${model.model}=>${model.identifier}`
        if(await this.$storage.getItem('remember-user') != null){
            this.user_input = await this.$storage.getItem('remember-user');
        }
        this.$function.checkperms()


    },
    methods:{
        async login(){
            const loading = await loadingController.create({ message: 'Please Wait a moment...', translucent: true });
            await loading.present();

            if(!this.$function.isTimeAuto()){
                this.$function.showAlert({header: 'Warning', message: 'Please enable time auto to use this app.'})
                return  await loading.dismiss();
            }
            let tz = this.$function.checkTimeZone()
            if(!tz.status){ return  await loading.dismiss(); }

            
            if(this.user_input.remember){
                await this.$storage.setItem('remember-user', (this.user_input));
            }
            let data = {
                username: this.user_input.username,
                password: MD5(this.user_input.password),
                device: this.device
            }
            let res = await this.$api.login(data)
            this.log_response = res
            if(!res.status){
                let alert = {header: 'Warning', message: res.message}
                this.$function.showAlert(alert)
                await loading.dismiss();
            }else{
                if(!res.isRegistered){
                    await loading.dismiss();
                    this.registerDevice()
                }else{
                    await loading.dismiss();
                    await this.$storage.setItem('session-user', (res.data));
                    await this.$storage.setItem('app-config', (res.appconfig));
                    this.$router.push('dashboard').then(() => { window.location.reload() });
                }
            }
            await loading.dismiss();
        },
        async registerDevice() {
            const alert = await alertController.create({
            header: 'Confirm',
            message: 'Do you want to register this device to your account?',
            buttons: [ { text: 'No', role: 'cancel' }, { text: 'Yes', role: 'confirm', handler: this.register } ],
            });
            await alert.present();
        },
        async register() {

            let res = await this.$api.savedata({
                tableName: 'spottv2.device_registered', 
                fields: {
                    userID: this.log_response.data.ID,
                    device: this.device
                },
                key: ['device']
            })
            if(res.error = 0){
                let alert = {header: 'Success!', message: 'Device registered successfully. Please login to continue.'}
                this.$function.showAlert(alert)
            }
            setTimeout(async () => {
                await this.login()
            }, 750);
            
            // const response = await this.$api.register({
            //     username: this.user_input.username,
            //     model: this.device
            // });
            // return response.status == true
            // ? this.showAlert({header: 'Success!', message: 'Device registered successfully. Please login to continue.'})
            // : response;
        },
    }
}
</script>

<style scoped>
.backdrop{
  background: rgb(0,18,64);
  background: linear-gradient(326deg, rgba(0,18,64,1) 0%, rgba(4,15,46,1) 43%, rgba(3,18,68,1) 74%, rgba(4,37,97,1) 100%);  
}
ion-button {
    --background: #f05454;
    --background-hover: #8d1a1a;
    --background-activated: #8d1a1a;
    --background-focused: #8d1a1a;
    --color: rgb(255, 255, 255);
    --border-radius: 50px;
    /* --border-color: #000; */
    /* --border-style: solid; */
    /* --border-width: 1px; */
    --box-shadow: 0 2px 6px 0 rgb(0, 0, 0, 0.25);
    --ripple-color: #8d1a1a;
    --padding-top: 10px;
    --padding-bottom: 10px;
  }
  ion-input.custom {
    --color: #fff !important;
    --placeholder-color: #ddd !important;
    --placeholder-opacity: 0.8 !important;

  }

  ion-input.custom.ios .input-bottom .helper-text,
  ion-input.custom.ios .input-bottom .counter,
  ion-input.custom.md .input-bottom .helper-text,
  ion-input.custom.md .input-bottom .counter {
    color: red;
  }
  ion-label{
    --color: rgb(255, 255, 255) !important;
  }
  ion-label.black{
    --color: rgb(0, 0, 0) !important;
  }
  ion-label.white{
    --color: rgb(255, 255, 255) !important;
  }
  ion-checkbox{
    --border-color: white;
    --border-radius: 4px;
    /* --size: 16px; */
  }

</style>