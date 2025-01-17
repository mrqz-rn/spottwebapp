<template>
   <IonPage>
      <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="dashboard" href="/dashboard" v-if="access.includes('1') == true">
            <ion-icon :icon="home" />
            <ion-label>Home</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="report" href="/report" v-if="access.includes('5') == true">
            <ion-icon :icon="listSharp" />
            <ion-label>Report</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="profile" href="/profile" v-if="access.includes('3') == true">
            <ion-icon :icon="person" />
            <ion-label>Profile</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="settings" href="/settings" v-if="access.includes('2') == true">
            <ion-icon :icon="settings" />
            <ion-label>Settings</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="faqs" href="/faqs" v-if="access.includes('4') == true">
            <ion-icon :icon="helpCircle" />
            <ion-label>FAQs</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
      
    </IonPage>
   
</template>

<script>
import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';
import {  cog , person, settings, listSharp, home, helpCircle } from 'ionicons/icons';

export default {
    components: {
        IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon
    },
    data(){
        return{
            home, cog, person, settings,listSharp,helpCircle,
            access: '',
            userSession: {}
        }
    },
    async created(){
        let user = await this.$function.getUser()
        this.userSession = user
        this.access = user.module_ac
    }
}
</script>