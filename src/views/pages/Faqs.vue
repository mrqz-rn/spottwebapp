<template>
    <IonPage>
        <ion-content>
          <div class="pa-3">
            <h2 class="pb-2">FAQs</h2>
            <div v-for="faq in faq_questions" :key="faq.id" class="d-block">
              <h4>{{ faq.question }}</h4>
              <p v-if="faq.answer != ''" class="ps-3 pb-2">{{ faq.answer }}</p>
              <div v-else>
                 <div v-for="(item,key) in faq.items" :key="item">
                   <p class="ps-3 pb-2"> {{(key + 1) + '. ' + item }}</p>
                 </div>
              </div>
            </div>
            <div class="pt-6">
              <h3>TROUBLESHOOT</h3>
              <p>Follow the steps below to troubleshoot basic warnings on your SPOTT application:</p>

              <p class="pt-4"><b>NO Location Warning</b></p>
              <img  src="/noLocation.png" class="pt-2" style="width: 94svw;"/>
              <p>This warning is displayed when you don't have a tagged location on your account.</p>
              <img  src="/calibrate.png" style="border-width: 2px; border-color: #949494; width: 94svw;" />
              <p>To resolved this warning, go to SPOTT Settings and tap the Calibrate button. Once the calibration is complete, tap Upload Location to save your location.</p>
              <img  src="/allowedloc.png" style="border-width: 2px; border-color: #949494; width: 94svw;"/>
              <p>You should have at least one allowed location on your account.</p>


              <p class="pt-4"><b>Invalid Current Location</b></p>
              <img  src="/invalidloc.png" class="pt-2" style="width: 94svw;"/>
              <p>This warning is displayed when you have an your current location doesn't match to your tagged allowed locations.</p>
              <p>To resolved this warning, make sure you have calibrated your allowed location and you are on the same location.</p>
              
              <p class="pt-4"><b>Device Location Unavailable</b></p>
              <img  src="/locationUnavailable.png" class="pt-2" style="width: 94svw;"/>
              <p>This warning is displayed when your device can not get your current location.</p>
              <p>To resolved this warning, make sure to turn on your location services and connect to the internet to establish your current location.</p>
            </div>
          </div>
        </ion-content>
    </IonPage>
</template>

<script>
import { IonPage,IonContent, IonImg } from '@ionic/vue';

export default {
  components: { IonPage,IonContent,IonImg },
  data(){
    return{
      faq_questions: [
          {id: 1, question: 'What is SPOTT (Sterling Paper Group Online Time Tracker)?', 
          answer:'SPOTT is an online time tracking tool developed by Sterling Paper Group of Companies to help employees track their working hours and served as their online biometric.' },
          // {id: 2, question: 'How do I install the online time tracking system on my mobile phone?', 
          // answer:'The SPOTT app can be downloaded from the SPGC wiki page or request the app link from HR department.' },
          {id: 2, question: 'How to calibrate and upload my work location(s) using online time tracking?', 
          answer:'',
          items: [
            'Open the SPOTT app on your mobile device',
            'Ensure your GPS/location services are enabled',
            'Open the menu and tap "Settings"',
            'On the screen, you will see a "Calibrate" button, click it 3 times to calibrate your location',
            'Once the calibration is complete, tap "Upload Location" to save your location',
          ]},
          {id: 3, question: 'How do I use the online tracking system to clock in and clock out?', 
          answer:'', 
          items: [
            'Open the SPOTT app on your mobile device',
            'Ensure your GPS/location services are enabled',
            'On the main screen, you will see options to "Time In" and "Time Out"',
            'Tap "Time In" when you start your work. The app will record your time and location',
            'When you finish your work, open the app again and tap "Time Out". The app will again record your time and location'
          ]},
          {id: 4, question: ' Can I use the online time tracking without an internet?', 
          answer:'', 
          items: [
            'The app requires an internet connection to sync data to the central server. However, it can store clock-in and clock-out data locally on your device if the internet is unavailable',
            'Once the internet connection is restored, the app will automatically sync the stored data to the server',
          ]},
          {id: 5, question: 'Do I need to log in each time I use the online tracking system?', 
          answer:'', 
          items: [
            'Once you have logged in initially, the SPOTT app will keep you logged in',
            'You do not need to log in again each time you use the app, unless you manually log out or there is a security update that requires re-authentication',
          ]},
          {id: 6, question: 'Can I access SPOTT from multiple devices?',
           answer:'Yes, SPOTT is accessible from any android devices, providing users with the flexibility to track time from anywhere with an internet connection',
           items: [
            'You can install the SPOTT app on multiple devices (e.g., your smartphone and tablet)',
            'Use your same login credentials on each device to access your account',
            'Data is synced across devices, so you can time in on one device and time out on another if needed',
            'Ensure each device is connected to the internet periodically to keep the data synchronized'
          ]},
          // {id: 8, question: 'How can I make an SPOTT account?', 
          // answer:'Reach out to your corresponding HR and request for creation of SPOTT account.' },
        ],
    }
  }
}
</script>