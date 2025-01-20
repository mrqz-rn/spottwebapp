<template>
<IonPage class="pt-4">
    <ion-toast 
      :class="snackbar.type" style="scale: 0.98;"
      position="top" :is-open="snackbar.status"  @didDismiss="snackbar.status = false"
      :message="snackbar.message"
    ></ion-toast>
    <ion-content v-if="!webCapturing"> 
        <IonCard class="py-4 mx-2" color="dark" style="border-radius: 25px;" >
            <ion-card-title class="subheader">SPOTT</ion-card-title>
            <ion-card-content class="justify-center pa-0" >
                <div class="d-grid">
                    <IonLabel class="header white-text">{{ display.time }}</IonLabel>
                    <IonLabel class="subheader white-text">{{ display.date }}</IonLabel>
                    <ion-button class="px-5 pt-4 main bold-text" @click="entertransaction()"
                    :disabled="!btnvalid" expand="full" size="large" shape="round" >
                        {{  trxmodetype == '0' ? 'Time In' : 'Time Out' }}
                    </ion-button>
                </div>
            </ion-card-content>
        </IonCard>
        <div class="d-flex pt-1 mx-3" style="gap: 10px">
            <ion-input v-model="display.datefrom"  :readonly="true" @click="pickDate(1)" class="dateInput pt-2"
            label="Date From" fill="outline" size="small" label-placement="stacked" ></ion-input>
            <ion-input v-model="display.dateto" :readonly="true" @click="pickDate(2)" class="dateInput pt-2"
            label="Date To" fill="outline"  label-placement="stacked" ></ion-input>
        </div>
        <ion-button @click="transferlogs()" :disabled="!transferbtn" v-if="session_user.isOffline == 1"
        class="pt-2 mx-4" expand="full" color="primary" shape="round">Transfer Logs ({{ transfercount }})</ion-button>
        <ion-list style="min-height: 30vh; max-height: 42vh; overflow-y: scroll;">
            <ion-item v-for="(data,key) in display_attlogs" :key="key" class="py-2 ps-3">
                <div class="" style="font-size: 16px !important; letter-spacing: .75px;">
                    <tr class="bold-text" :class="data.trxIN.upload_status == 0 ? 'text-red' : ''">
                        <td>IN:</td>
                        <td > &nbsp {{data.trxIN.trxdate}}</td>
                        <td> &nbsp {{ data.trxIN.trxtime }}</td>
                    </tr>
                    <tr class="bold-text" :class="data.trxOUT.upload_status == 0 ? 'text-red' : ''">
                        <td>OUT:</td>
                        <td > &nbsp {{data.trxOUT.trxdate || '---'}}</td>
                        <td> &nbsp {{ data.trxOUT.trxtime || '---'}}</td>
                    </tr>
                </div>
                <ion-button class="ma-auto" @click="viewLogs(data)" id="open-dialog" expand="block" shape="round" dark>
                    <ion-icon class="px-2" :icon="eye" size="default" color="white" />
                </ion-button>
            </ion-item>
        </ion-list>
        <ion-button class="open-custom-dialog" id="open-custom-dialog" expand="block" shape="round" style="display: none;"/>
        <ion-modal id="example-modal" ref="modal1" trigger="open-custom-dialog" :can-dismiss="viewLog.canDismiss" >
          <div class="wrapper" >
            <h2 class="d-flex justify-center pt-2">Attendance Log</h2>
            <div class="pa-2 px-4 d-block" >
              <h3>Time In</h3>
              <ion-label style="" class="px-2">
                <span class="pe-3">Date: {{ viewLog.data.trxIN.trxdate }}</span>
                <span class="pe-3">Time: {{ formattedTime(viewLog.data.trxIN.trxtime) }}</span>
              </ion-label>
              <p style="" class="px-2">Location:  {{ viewLog.data.trxIN.latitude + ' : ' + viewLog.data.trxIN.longitude }} </p>
              <h3>Time Out</h3>
              <ion-label style="" class="px-2">
                <span class="pe-3">Date: {{ viewLog.data.trxOUT.trxdate || '---' }}</span>
                <span class="pe-3">Time: {{ viewLog.data.trxOUT.trxtime ? formattedTime(viewLog.data.trxOUT.trxtime) : '---'  }}</span>
              </ion-label>
              <p style="" class="px-2">Location:  {{ viewLog.data.trxOUT.latitude + ' : ' + viewLog.data.trxOUT.longitude }} </p>
              <div class="d-flex justify-space-between pt-2">
                <h3>Remarks</h3>
                <p style=" color: #0068d1; text-decoration: underline" @click="viewLog.inputrem = !viewLog.inputrem">Input / Edit</p>
              </div>
              <div v-if="viewLog.inputrem == true">
                <ion-textarea v-model="viewLog.remark" id="remarkarea"
                class="pt-3" label="Remarks" fill="outline"  label-placement="stacked" 
                placeholder="(Optional)">
                </ion-textarea>
                <ion-button class="pt-3" expand="full" shape="round" @click="saveRemarks()">Save</ion-button> 
              </div>
              <p v-else style="" class="px-2" >{{ viewLog.data.trxIN.remark || '---' }}  </p>
              <ion-button class="pt-3" expand="full" shape="round" color="medium" @click="closeModal()">Close</ion-button>
            </div>
          
          </div>
        </ion-modal>
        <ion-button id="open-date" expand="block" style="display: none;">Date modal</ion-button>
        <ion-modal id="example-modal" ref="modal" trigger="open-date"  :can-dismiss="datepick.canDismiss">
        <div class="wrapper">
            <h2 class="d-flex justify-center pt-2"></h2>
            <ion-datetime v-model="datepick.model" presentation="date" 
            :min="datepick.type == 1 ? `` : `${new Date(this.current.datefrom).toLocaleDateString('en-CA')}T00:00:00`"
            :max="`${new Date().toLocaleDateString('en-CA')}T23:59:59`"/>
            <div class="pa-3">
            <ion-button expand="full" class="main" shape="round" @click="confirmPick()">Confirm</ion-button>
            </div>
        </div>
        </ion-modal>
    </ion-content>
    <div v-if="webCapturing" style="position: absolute; top: 50%; transform: translateY(-50%); z-index: 1005 !important;">
        <img v-if="webImage" style="object-fit: contain;"
        :src="webImage" alt="Captured Image" :style="isonWeb ? ' width: 100vw !important;' : 'width: 100vw !important;'"/>
        <video v-else ref="video" autoplay :style="isonWeb ? 'width: 100vw !important;' : 'width: 100vw !important;'"></video>
        <div v-if="webImage" class="d-flex justify-center px-10 pt-4" style="gap: 5vw;">
            <ion-button shape="round" @click="retakeImage" class="" color="medium">
            <ion-icon slot="icon-only" :icon="arrowUndo" class="ma-2"></ion-icon>
            </ion-button>
            <ion-button shape="round" @click="saveCapture" class="" color="success" dark>
            <ion-icon slot="icon-only" :icon="save" class="ma-2"></ion-icon>
            </ion-button>
            <ion-button style="opacity: 0;"></ion-button>
        </div>
        <div v-else class="d-flex justify-center px-10 pt-4" style="gap: 5vw;">
            <ion-button shape="round" @click="stopCamera()" class="" color="medium">
            <ion-icon slot="icon-only" :icon="close" class="ma-2"></ion-icon>
            </ion-button>
            <ion-button shape="round" @click="captureImage" class="">
            <ion-icon slot="icon-only" :icon="camera" class="ma-2"></ion-icon>
            </ion-button>
            <ion-button style="opacity: 0;"></ion-button>
        </div>
        <canvas ref="canvas" width="640" height="480" style="display: none;"></canvas>
    </div>
</IonPage>
</template>

<script>
import { IonPage,IonToast,IonContent,IonCard,IonCardTitle,IonCardContent,IonLabel,IonInput,
    IonButton,IonSpinner,IonList,IonModal,IonTextarea,IonItem,IonIcon,IonDatetime,loadingController
} from '@ionic/vue';
import { eye, book, camera, save, close, arrowUndo } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export default {
    components: {  IonPage,IonToast,IonContent,IonCard,IonCardTitle,IonCardContent,IonLabel,IonInput,
    IonButton,IonSpinner,IonList,IonModal,IonTextarea,IonItem,IonIcon,IonDatetime,loadingController },

    data(){
        return{
            eye, book, camera, save, close, arrowUndo,
            isonWeb: false,
            webCapturing: false,
            webImage: null,
            stream: null,
            snackbar: {status: false, type: 'success', message: 'test'},
            session_user: {},
            user_location: '',
            user_device: '',
            attlogs: [],
            display: {
                time: '00:00', date: '00/00/0000',
                datefrom: '00/00/0000', dateto: '00/00/0000'
            },
            current: {
                time: '00:00', date: '00/00/0000',
                datefrom: '00/00/0000', dateto: '00/00/0000'
            },
            datepick: {
                canDismiss: true,
                type: 1,
                model: `${new Date().toLocaleDateString('en-CA')}T00:00:00`,
            },
            viewLog: {
                canDismiss: true,
                data: {},
                remark: '',
                inputrem: false,
            },
            trxmodetype: 0,
            background_count: 0,
            location_bk: {
                latitude: 0,
                longitude: 0
            },
            location: {
                latitude: 0,
                longitude: 0
            },
            
        }
    },
    beforeCreate(){
        setInterval(() => {
            this.getTimeDate();
        }, 1000);
    },
    async created(){
      
    },
    async mounted(){
        const date = new Date();
        date.setDate(date.getDate() - 15);
        this.current.datefrom = date.toLocaleDateString('en-CA');
        this.display.datefrom = this.$function.formatDate(date.toLocaleDateString('en-CA'))
        this.current.dateto =  new Date().toLocaleDateString('en-CA');
        this.display.dateto =  this.$function.formatDate(new Date().toLocaleDateString('en-CA'))
        this.isonWeb = await this.$function.isWeb()
        await this.initialize()
        this.user_device = await this.$function.getDeviceInfo()
        if(!this.user_location){
            await this.fetchUserLocations()
        }
    },
    methods: {
        async getLogs(){
            let res = await this.$api.masterselect({
                table_name: `${this.session_user.isLive == '1' ? 'attlogs' : 'attlogs_test'}`,
                having: {
                    userID: this.session_user.ID,
                    'trxdate >=': this.current.datefrom
                },
                order_by: {trxdate: 'asc', trxtime: 'asc'}
            })
            await this.$storage.setItem('session-attlogs', (res))
        },
        async initialize(){
            this.session_user = await this.$function.getUser()
            if(!this.session_user){
                this.$router.push('/')
            }
            let attlogs = await this.$function.getAttlogs()
            if(attlogs[0] == null){ attlogs.shift(); }
            if(attlogs > 350){ 
                let diff = attlogs.length - 350
                attlogs.splice(0, diff)
            }
            if(attlogs.length == 0){
                await this.getLogs()
            }else{
                attlogs.filter(e => e.trxdate >= this.current.datefrom)
                this.$storage.setItem('session-attlogs', (attlogs))
            }
            this.attlogs = await this.$function.getAttlogs()
            this.user_location = await this.$function.UserLocation()
            this.snackbar.status = true
            this.snackbar.type = 'info'
            this.snackbar.message = 'Initializing location...'
            let location = await this.$function.getLocation()
            if(location.status == true){
                this.snackbar.type = 'success'
                this.snackbar.message = 'Location established'
                this.location_bk = location
            }
            setTimeout(() => {
                this.snackbar.status = false
                this.background_count++
                this.$forceUpdate()
            }, 2500)
        },
        getTimeDate(){
            const now = new Date();
            this.current.time = now.toLocaleTimeString('en-GB', { hour12: false });
            this.current.date = now.toLocaleDateString('en-CA');

            this.display.time = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            this.display.date = now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
        },
        async fetchUserLocations(){
            let location = []
            let res = await this.$api.masterselect({
                table_name: 'user_loc_view',
                having: {
                    userID: this.session_user.ID
                }
            })
            if(res.length > 0){
                res.forEach(locs => {
                    location.push(locs.longitude + ":" + locs.latitude + ":" + locs.radius)
                });
                this.user_location = location.join(',')
                await this.$storage.setItem('session-location', (this.user_location));                
            }
        },
        async entertransaction(){
            const loading = await loadingController.create({ message: 'Please Wait a moment...', translucent: true });
            await loading.present();
            try {
                await this.$function.checkperms()
                let net = await this.$function.getNet()
                let hasdata = await this.$function.checknet()
                let res = await this.$function.validateSettings()
                let location = await this.$function.getLocation()
                if(location.status){
                    this.location = location
                }else{
                    this.location = this.location_bk
                }
                if(res.status == false){
                    this.$function.showAlert({header: 'Warning', message: res.message})
                    return await loading.dismiss();
                }
                let location_valid = this.checkIfWithinLocation(this.location.longitude,this.location.latitude)
                if(!location_valid){
                    this.$function.showAlert({header: 'Warning', message: 'You are not within the allowed locations.'})
                    return await loading.dismiss();
                }
                let photo = {}
                
                if(this.session_user.imageCapture == 1){
                    let loadingDiv = document.querySelector('ion-loading');
                    loadingDiv.classList.add('hide_loader');
                    if(this.isonWeb){
                        this.webCapturing = true;
                        await new Promise(resolve => {
                        const handler = () => {
                            document.removeEventListener('imageCaptured', handler);
                            resolve();
                        };
                    
                        document.addEventListener('imageCaptured', handler);
                        loadingDiv.classList.add('hide_loader');
                            this.startCamera()
                        });
                    
                        photo = {
                            status: true,
                            base64String: this.webImage
                        }
                        loadingDiv.classList.remove('hide_loader');

                    } else {
                        photo = await this.openCamera()
                        if(!photo.status){
                            this.$function.showAlert({header: 'Warning', message: 'Image captured failed'})
                            return await loading.dismiss();
                        }
                    }
                }else{
                    photo = {
                        status: true,
                        base64String: 'NO IMAGE'
                    }
                }
               

                let data_log = {}
                data_log.id = this.$function.generateUniqueId()
                data_log.trxdate = this.current.date;
                data_log.username = this.session_user.username;
                data_log.trxtime = this.current.time;
                data_log.trxmode = this.trxmodetype;
                data_log.timestamp = String(new Date());
                data_log.longitude = location.longitude;
                data_log.latitude = location.latitude;
                data_log.platform = `${this.user_device.model}=>${this.user_device.identifier}`
                data_log.picture = photo.base64String;
                data_log.fileName = '';
                data_log.pathName = '';
                data_log.status = 0;
                data_log.upload_status = 0;
                data_log.uploaded_on = '';

                if(net.connected && hasdata){
                    let config = {
                        path_folder: 'uploads/spott/images/' + this.session_user.username,
                        max_size: 15000,
                        base64data: photo.base64String.replace(/data:image\/(jpeg|png);base64,/, '')
                    }
                    if(this.session_user.imageCapture == 1){
                        let upload = await this.$api.fileUpload(config)
                        if(upload.status == true){
                            data_log.picture = "UPLOADED"
                            data_log.fileName = upload.file_name
                            data_log.pathName = upload.file_path
                        }
                    }
                   
                    if(this.session_user.isOffline != '1'){
                        let res = await this.savetoserver(data_log)
                        if(res.error == 0){
                            data_log.upload_status = 1
                            data_log.uploaded_on = new Date()
                        }
                    }
                }
                await this.localSaveAttlogs(data_log)
                await loading.dismiss();

            } catch (error) {
                console.log(error)
                await loading.dismiss();

            }
        },

        async localSaveAttlogs(data){
            
            this.$storage.pushAttlogs(data)
            this.attlogs.push(data)
            // await this.$storage.setItem('session-location', (this.attlogs));    
        },
        async savetoserver(data_log){
            let check = await this.$api.masterselect({
                table_name: `${this.session_user.isLive == '1' ? 'attlogs' : 'attlogs_test'}`,
                having: {
                    userID: this.session_user.ID,
                    trxdate: data_log.trxdate,
                    trxtime: data_log.trxtime,
                    trxmode: data_log.trxmode
                }
            })
            let res = await this.$api.savedata({
                tableName: `${this.session_user.isLive == '1' ? 'attlogs' : 'attlogs_test'}`,
                fields: {
                    userID: this.session_user.ID,
                    trxdate: data_log.trxdate,
                    trxtime: data_log.trxtime,
                    trxmode: data_log.trxmode,
                    longitude: data_log.longitude,
                    latitude: data_log.latitude,
                    platform: data_log.platform,
                    picture: data_log.picture,
                    fileName: data_log.fileName,
                    pathName: data_log.pathName,
                    upload_status: check.length > 0 ? 1 : data_log.upload_status,
                    uploaded_on: check.length > 0 ? new Date() : data_log.uploaded_on
                },
                key: ['id','userID','trxdate','trxtime','trxmode']
            })
            return res
        },

        async transferlogs(){
            const loading = await loadingController.create({ message: 'Please Wait a moment...', translucent: true });
            await loading.present();

            try {
                let net = await this.$function.getNet()
                let hasdata = await this.$function.checknet()
                if(net.connected && hasdata){
                    this.attlogs.forEach(async e => {
                        if(e.upload_status != 1){
                            let res = await this.savetoserver(e)
                            if(res.error == 0){
                                e.upload_status = 1
                                e.uploaded_on = new Date().toLocaleString('en-CA')
                                this.$storage.updateAttlogs(e)
                            }
                        }
                    });   
                    await loading.dismiss();
                    this.$function.showAlert({header: 'Success', message: 'Attlogs has been uploaded successfully.'})
                }else{
                    await loading.dismiss();
                    this.$function.showAlert({header: 'Warning', message: 'No internet connection.'})
                }
            } catch (error) {
                await loading.dismiss();
                this.$function.showAlert({header: 'Warning', message: error})
                console.log(error)
            }
        },
        async openCamera(){
            let data = {
                status: false,
                base64String: '',
                message: ''
            }
            try {
                let camera = await Camera.getPhoto({
                    resultType: CameraResultType.Base64,
                    source: CameraSource.Camera,
                })
                let blob = await this.$function.dataUrlToBlob('data:image/jpeg;base64,' + camera.base64String);
                let compressedBlob = await this.$function.compressImage(blob, 0.3);
                let base64String = await this.$function.convertBlobToBase64(compressedBlob);
                data.base64String = base64String
                data.status = true
                data.message = 'Image captured successfully'
            } catch (error) {
                data.status = false
                data.message = error
            }
            
            return data
        },
        viewLogs(data){
            this.viewLog.canDismiss = false
            this.viewLog.data = data
            this.viewLog.remark = data.trxIN.remark
            const button = document.getElementById('open-custom-dialog');
            if (button) {
                button.click();
            }
        },
        closeModal(){
        this.viewLog.canDismiss = true
        this.$refs.modal1.$el.dismiss();
        this.viewLog.inputrem = false
        this.viewLog.remark = ''
        
        },
        checkIfWithinLocation(long,lat){
            if(this.session_user.geoFence == '0' || this.session_user.disableLocation == '1'){
                return true
            }else{
                let status = 0;
                this.allowedLocations.forEach(e => {
                if(this.$function.computeDistance(e.lat,e.long,lat,long) <= parseFloat(e.radius)){
                    status = status + 1;
                }
                });
                return status > 0 ? true : false;
            }
        },
        pickDate(data){
            this.datepick.canDismiss = false
            if(data == 1){
                this.datepick.type = 1
                this.datepick.model = this.current.datefrom
            }else if(data == 2){
                this.datepick.type = 2
                this.datepick.model = this.current.dateto
            }
            const datebtn = document.getElementById('open-date');
            if (datebtn) {
                datebtn.click();
            }
        },
        confirmPick(){
            this.datepick.canDismiss = true
            if(this.datepick.type == 1){
                this.display.datefrom = this.$function.formatDate(this.datepick.model)
                this.current.datefrom = this.$function.dateFormat(this.datepick.model)
            }else{
                this.display.dateto = this.$function.formatDate(this.datepick.model)
                this.current.dateto = this.$function.dateFormat(this.datepick.model)
            }
            this.$refs.modal.$el.dismiss();
        },

        async startCamera() {
            this.webImage = null
            try {
                this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
                this.$refs.video.srcObject = this.stream;
            } catch (error) {
                console.error('Error accessing the camera:', error);
            }
        },
        captureImage() {
            if (this.$refs.video.srcObject) {
                const canvas = this.$refs.canvas;
                const context = canvas.getContext('2d');
                context.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
                this.webImage = canvas.toDataURL('image/png');
            }
        },
        retakeImage(){
            this.webImage = null
            if (this.stream) {
                const tracks = this.stream.getTracks();
                tracks.forEach(track => track.stop());
                // this.$refs.video.srcObject = null;
                this.stream = null;
            }
            this.startCamera()
            this.$forceUpdate()
        },
        saveCapture() {
            const event = new CustomEvent('imageCaptured');
            document.dispatchEvent(event);
            this.stopCamera()
            this.webCapturing = false
        },
            stopCamera() {
            if (this.stream) {
                const tracks = this.stream.getTracks();
                tracks.forEach(track => track.stop());
                // this.$refs.video.srcObject = null;
                this.stream = null;
                this.webCapturing = false
            }
        },
        formattedTime(time) {
            let [hours, minutes, seconds] = time.split(':');
            let date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(seconds);
    
            return date.toLocaleTimeString(); 
        },

    },
    computed: {
        btnvalid(){
            return this.location_bk.status 
        },
        transferbtn(){
            let logs = this.attlogs
            return logs.filter(e => e.upload_status == '0').length > 0
        },
        transfercount(){
            let logs = this.attlogs
            return logs.filter(e => e.upload_status == '0').length
        },
        allowedLocations(){
            let loc =  this.user_location ? this.user_location.split(",") : [];
            let locs = [];
            loc.forEach(e => {
            let str = e.split(":");
            locs.push({'long': str[0],'lat': str[1],'radius':str[2]});
            })
            return locs;
        },
        user_attlogs(){
            let data = this.attlogs.reverse()
            return data
        },
        display_attlogs(){
            const attlogs = this.attlogs.filter(e => new Date(e.trxdate) >= new Date(this.$function.defaultDateFormat(this.display.datefrom)) && 
            new Date(e.trxdate) <= new Date(this.$function.defaultDateFormat(this.display.dateto)));
            if(attlogs.length == 0) return []
            let result = [], setTrx = {}
            attlogs.forEach((t, i) => {
                if (t.trxmode == "0") {
                setTrx.trxIN = t
                } else if (setTrx.trxIN) {
                setTrx.trxOUT = t
                result.push(setTrx)
                setTrx = {}
                }
            });
            if(setTrx.trxIN){
                setTrx.trxOUT = { trxmode: "1", trxdate: '', trxtime: '' }
                result.push(setTrx)
            }
            return result.reverse()
        },
    },
    watch: {
        async background_count() {
            if (this.background_count > 0) {
                let location = await this.$function.getLocation()
                if(location.status == true){ this.location_bk = location }
                setTimeout(() => {
                    this.background_count++
                }, 10000);
                if(this.session_user.isOffline != 1){
                    if(this.attlogs.filter(e => e.upload_status != '1').length > 0){
                        this.transferlogs()
                    }
                }
            }
        },
        attlogs: {
            handler(newValue) {
                let data = newValue[newValue.length - 1];
                if(data){
                this.trxmodetype = data.trxmode == '0' ? '1' : '0';
                }else{
                this.trxmodetype = '0';
                }
                this.$forceUpdate()
            },
            deep: true, 
        },
    }
}
</script>

<style scoped>
.header{
  font-size: 6vh;
  font-weight: 600;
  color: black;
  text-align: center;
}
.subheader{
  font-size: 2.8vh;
  font-weight: 600;
  color: black;
  text-align: center;
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
    width: 90vw !important;
  }

</style>

<style>
.hide_loader{
    position: relative !important;
    z-index: 10 !important;
}
</style>