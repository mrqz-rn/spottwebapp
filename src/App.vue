<template>
    <ion-app style="background-color: whitesmoke;"> 
    <ion-router-outlet />
  </ion-app>
</template>

<script>

import { IonApp, IonRouterOutlet, alertController } from '@ionic/vue';

import { App } from '@capacitor/app';
import { useBackButton, useIonRouter } from '@ionic/vue';

export default {
  components: {
    alertController
  },
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  data(){
    return{

    }
  },
  async created(){
    this.$storage.initStorage();
  },
  mounted(){
    let lastTimeBackPress = 0;
    useBackButton(500, () => {
      if (new Date().getTime() - (lastTimeBackPress || 0) < 1000) {
        App.exitApp();
      } else {
        lastTimeBackPress = new Date().getTime();
      }
    });

    setInterval(() => {
      this.$function.checkperms()
    }, 15000);
  },
}
</script>

<style>
*{
  /* color: black; */
  /* background-color: white; */
}
::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 10px;
	background-color: #F5F5F5;
}

::-webkit-scrollbar
{
	width: 4px;
  height: 5px;
	background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #555;
}

#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}

ion-button.main{
    --background: #f05454;
  }
  ion-button.success{
    --background: #009505;
  }
  ion-toast.warning{
    --background: #ff9800;
    --color: #ffffff;
    --box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, 0.2);
  }
  ion-toast.warning::part(message) {
    text-align: center;
    font-size: 18px
  }
  ion-toast.success{
    --background: #4caf50;
    --color: #ffffff;
    --box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, 0.2);
  }
  ion-toast.success::part(message) {
    text-align: center;
    font-size: 18px
  }
  ion-toast.danger{
    --background: #f44336;
    --color: #ffffff;
    --box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, 0.2);
  }
  ion-toast.danger::part(message) {
    text-align: center;
    font-size: 18px
  }
  ion-toast.info{
    --background: #2196f3;
    --color: #ffffff;
    --box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, 0.2);
  }
  ion-toast.info::part(message) {
    text-align: center;
    font-size: 18px
  }

  ion-toast.custom-toast {
    --background: #292929;
    --box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, 0.2);
    --color: #ffffff;
  }

  ion-toast.custom-toast::part(message) {
    text-align: center;
    font-size: 18px
    /* font-style: italic; */
  }
  .custom-toast div{
    border-radius: 20px !important;
  }

  .not_uploaded{
    color: red !important;
  }
  .displaydate{
    font-size: 19px !important; 
    font-weight: 600 !important;  
    font-family: Arial, Helvetica, sans-serif !important;
  }
  .displaytime{
    font-family: Arial, Helvetica, sans-serif !important;

    font-size: 19px !important; 
  }
 .chipmode{
  font-family: Arial, Helvetica, sans-serif !important;
  padding-top: 2px;
  color: white;
  width: 70px !important; 
  font-size: 16px !important; 
  font-weight: 600 !important; 
  justify-content: center !important;
 }
 .darkInput{
    --border-color: #212121;
    --border-radius: 4px;
    --padding-start: 16px;
    --padding-end: 16px;
    min-height: 38px;
    --color: black;
}
.black--text{
    color: black;
}
ion-button#custom-success {
    --background: #2E7D32;
    --background-hover: #2E7D32;
    --background-activated: #2E7D32;
    --background-focused: #2E7D32;
    --color: white;
    /* min-height: 1.9em !important; */
  }
  .bold-text{
    font-weight: 600 !important;
  }
</style>
