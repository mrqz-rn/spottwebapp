<template>
<ion-page>
        <ion-content class="pa-4">
            <ion-card class=" pb-3 ma-3" color="dark"  style="border-radius: 25px; padding: 3vh;">
              <div class="d-flex pb-2">
                  <ion-icon :icon="camera" size="large" style="scale: 1.2 !important; width: 60px;" class="py-2"/>
                  <ion-label class="px-3 align-self-center" style="font-size: 3vh; font-weight: 600;">ImageCapture: {{ session_user.imageCapture == 1 ? 'YES':'NO' }}</ion-label>
                </div>
                <div class="d-flex pb-2">
                  <ion-icon :icon="location" size="large" style="scale: 1.2 !important; width: 60px;" class="py-2"/>
                  <ion-label class="px-2 align-self-center" style="font-size: 3vh; font-weight: 600;">GeoFencing: {{ session_user.geoFence == 1 ? 'YES':'NO' }}</ion-label>
                </div>
               
                <div >
                  <ion-button @click="startCalibrate()" v-if="calibrate.length < 3" :disabled="!validButton"
                  expand="full" class="main pt-2" shape="round" size="large" 
                  style="min-height: 2vh !important; height: 8vh; color: white; font-weight: 600; font-size: 3vh;">CALIBRATE</ion-button>
                  <ion-button @click="uploadLocation()" v-else
                  expand="full" class="main pt-2" shape="round" size="large" style="color: white; font-weight: 600;">UPLOAD LOCATION</ion-button>
                </div>
                <h4 class="d-flex justify-center pt-1" style="font-size: 2.2vh;">Max Location: {{ session_user.noOfLocation }}</h4>
              </ion-card>
            <h4 class="px-4" style="font-size: 2.7vh;">Configured Locations({{ Locations.length }}):</h4>
            <ion-list  class="mx-3" style="height: 40vh; overflow-y: auto;">
              <ion-item v-for="(loc, key) in Locations" :key="key"> 
                <div class="d-block">
                  <ion-label style="font-size: 2.2vh;">{{ address[key] ? address[key].display_name : 'Searching Address....' }}</ion-label>
                  <div class="d-flex ">
                    <h5 class="pe-5" style="font-size: 1.9vh;">Lat: {{ loc.lat }}</h5>
                    <h5 style="font-size: 1.9vh;">Long: {{ loc.long }}</h5>
                  </div>
                </div>
              </ion-item>
            </ion-list>
            <div style="position: absolute; bottom: 0px; left: 0px; transform: translate(0%, 0%); width:100%;">
              <ion-button @click="logout()" expand="full" class="main pa-3 pb-4" shape="round"  style="color: white; font-weight: 600;">Log Out</ion-button>
            </div>
            
        </ion-content>
    </ion-page>

</template>

<script>
import { IonPage,IonContent,IonList, IonItem, IonLabel, IonButton, IonIcon,IonCard,alertController,loadingController 
} from '@ionic/vue';
import { camera, location, book} from 'ionicons/icons';

export default {
    components: { IonPage,IonContent,IonList, IonItem, IonLabel, IonButton, IonIcon,IonCard,alertController,loadingController },
    data(){
        return{
            camera,location,book,
            session_user:{},
            calibrate:[],
            session_loc:'',
            address:[],
            Locations:[]
        }
    },
    async created(){
        this.session_user = await this.$function.getUser();
        if(!this.session_user){
            this.$router.push('/')
        }
        this.session_loc = await this.$function.UserLocation();
        let loc =  this.session_loc ? this.session_loc.split(",") : [];
            let locs = [];
            loc.forEach(e => {
            let str = e.split(":");
            this.Locations.push({'long': str[0],'lat': str[1],'radius':str[2]});
        })
        let net = await this.$function.getNet()
        let hasdata = await this.$function.checknet()
        if(net.connected && hasdata){
            await this.fetchAddress()
            this.$forceUpdate();
        }
    },
    methods:{
        async startCalibrate(){
            const loading = await loadingController.create({ message: 'Calibrating...', translucent: true });
            await loading.present();
            try {
                await this.$function.checkperms()
                let net = await this.$function.getNet()
                let hasdata = await this.$function.checknet()
                let res = await this.$function.validateSettings()
                if(!net.connected){
                    this.$function.showAlert({header: 'Warning', message: 'Please connect to internet'})
                    return await loading.dismiss();
                }
                // if(!hasdata){
                //     this.$function.showAlert({header: 'Warning', message: 'Please check your interenet/data connection'})
                //     return await loading.dismiss();
                // }
                if(res.status == false){
                    this.$function.showAlert({header: 'Warning', message: res.message})
                    return await loading.dismiss();
                }
                const coords = async () => {
                    const coords = await this.$function.getLocation()
                    return coords
                }
                do {
                    this.calibrate.push(await coords());
                } while (this.calibrate.length < 5);
                this.$function.showAlert({header: 'Success', message: 'Location captured successfully. Please proceed to uploading'})
                await loading.dismiss();

            } catch (error) {
                console.log(error)
                this.$function.showAlert({header: 'Warning', message: error})
                await loading.dismiss();
            }
        },
        async uploadLocation(){
            const loading = await loadingController.create({ message: 'Uploading location...', translucent: true });
            await loading.present();
            let long = 0;
            let lat = 0;
            this.calibrate.forEach(e => {
                long += parseFloat(e.longitude);
                lat += parseFloat(e.latitude);
            });
            let data = {
                long: (long / 5).toFixed(4),
                lat: (lat / 5).toFixed(4),
                radius: this.Locations[this.Locations.length - 1].radius
            };
            if (this.Locations.some(e => e.lat == data.lat && e.long == data.long)) {
                await loading.dismiss();
                this.calibrate = [];
                return this.$function.showAlert({header: 'Notice', message: 'Location already exists.', buttons: ['Okay'], })
            }

            let res = await this.$api.savedata({
                tableName: 'allowed_location',
                fields: {
                    userID: this.session_user.ID,
                    latitude: data.lat,
                    longitude: data.long
                },
                key: ['userID', 'latitude', 'longitude']
            })
            if (res.result == true && res.error == 0) {
                await loading.dismiss();
                this.$function.showAlert({header: 'Success', message: 'Location saved successfully.', buttons: ['Okay'], })
                this.Locations.push(data);
                this.calibrate = [];
                let location_str = ''
                let location_arr = []
                this.Locations.forEach(locs => {
                    location_arr.push(locs.long + ":" + locs.lat + ":" + locs.radius)
                });
                location_str = location_arr.join(',')
                await this.$storage.setItem('session-location', (location_str)); 
                this.$forceUpdate();
                console.log(this.Locations)
            }else{
                await loading.dismiss();
                this.$function.showAlert({header: 'Warning', message: 'Something went wrong. Please try again later.', buttons: ['Okay'], })
            }
        },
        async logout(){
            let attlogs = await this.$function.getAttlogs()
            if(attlogs.filter(e => e.upload_status != '1').length > 0){
                this.$function.showAlert({header: 'Warning', message: 'You have unsaved logs. Please upload before logging out.'})
                return
            }
            const alert = await alertController.create({
            header: 'Confirm',
            message: 'Are you sure you want to logout?',
            buttons: [ 
            { text: 'No', role: 'cancel', handler: () => { console.log('Alert canceled') } },
            { text: 'Yes', role: 'confirm', handler: async  () => { 
                // await this.$storage.clearStorage(); 
                await this.$storage.removeItem('session-location');
                await this.$storage.removeItem('session-user');
                await this.$storage.removeItem('session-attlogs');
                setTimeout(() => {
                this.$router.push('/').then(() => { window.location.reload() });
                }, 250);
            } },
        ],
        });
        await alert.present();
        },
        async fetchAddress() {
            this.address = await Promise.all(this.Locations.map(e => this.$api.addressapi({ latitude: e.lat, longitude: e.long })  ));
            this.$forceUpdate();
        },
    },
    computed:{
        validButton(){
            if(this.session_user.calibrateStatus != 1){
                return false
            }
            if(this.Locations.length == this.session_user.noOfLocation){
                return false
            }
            return true
        },
        // Locations(){
        //     let loc =  this.session_loc ? this.session_loc.split(",") : [];
        //     let locs = [];
        //     loc.forEach(e => {
        //     let str = e.split(":");
        //     locs.push({'long': str[0],'lat': str[1],'radius':str[2]});
        //     })
        //     return locs;
        // },
    }
}
</script>