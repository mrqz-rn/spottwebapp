<template>
    <ion-page class="backdrop">
        <div class="d-flex justify-center backdrop">
            <div style="position: absolute; top: 50%; transform: translateY(-50%); width: 80vw;">
                <img class="d-flex pb-5" style="height: 15vh; margin: auto;" src="/new.png"/>
                <h3 class="d-flex justify-center pb-2" style="color: white;">New Version Available</h3>
                <i class="d-flex justify-center pb-2" style="color: white;">SPOTT {{ app_config.version }}</i>
                <p class="pb-7" style="text-align: center; color: #BDBDBD;">Please download and install the new version to access our latest features</p>
                <ion-button @click="updateNow()" class="mb-2" expand="full" color="primary" shape="round">Update Now</ion-button>
                <ion-button @click="later()" expand="full" color="medium" shape="round">Close the app</ion-button>
            </div>
        </div>
    </ion-page>
</template>

<script>
import { IonPage, IonButton } from '@ionic/vue';
import { Browser } from '@capacitor/browser';

export default {
    name: 'Update',
    components: { IonPage, IonButton },
    data() {
        return {
            app_config: {}
        }
    },
    async created() {
        this.app_config = await this.$function.getAppConfig()
    },
    methods: {
        async updateNow() {
            await Browser.open({ url: app_config.apilink });
        },
        later(){
            navigator['app'].exitApp();
        }
    }

}


</script>

<style scoped>
.backdrop{
  background: rgb(0,18,64);
  background: linear-gradient(326deg, rgba(0,18,64,1) 0%, rgba(4,15,46,1) 43%, rgba(3,18,68,1) 74%, rgba(4,37,97,1) 100%);  
}
</style>