import axios from 'axios';
import { Network } from '@capacitor/network';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import { Device } from '@capacitor/device';
import { DatetimeSetting } from 'capacitor-datetime-setting';
import { alertController,getPlatforms } from '@ionic/vue';



const MyFunctions = {
  install(app) {
    const storage = app.config.globalProperties.$storage;
  
    app.config.globalProperties.$function = {
      async checknet(){
        try {
          let data = await fetch('https://httpbin.org/get')
          if(data.status == 200){
            return true
          }else{
            return false
          }
        } catch (error) {
          console.log(error)
          return false
        }
      

        
      },
      async getNet(){
        return await Network.getStatus();
      },
      async checkperms() {
        const deviceInfo = await Device.getInfo();
        if(['android', 'ios'].includes(deviceInfo.platform)){
          const promises = [];
          promises.push(Geolocation.checkPermissions());
          promises.push(Camera.checkPermissions());
          const [loc, cam] = await Promise.all(promises);
          if (loc.location != 'granted') await Geolocation.requestPermissions();
          if (cam.camera != 'granted') await Camera.requestPermissions();
        }else{
          // console.log('Not android or ios');
        }
      },
      async isTimeAuto(){
        return await DatetimeSetting.isAutoTimeEnabled();
      },
      checkTimeZone(){
        const timezone = String(new Date()).substr(25, 8);
        let data = {status: true, header: 'Success', message: 'Your timezone is set to ' + timezone}
        if (timezone != 'GMT+0800'){
          data = {status: false, header: 'Warning', message: 'Please set your timezone to GMT+0800.'}
          this.showAlert(data)
        }
        return data  
      },
      async getLocation(){
        let result = {}
        const deviceInfo = await Device.getInfo();
     
        if(!['android', 'ios'].includes(deviceInfo.platform)){
          const position = await new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject)
          );
          result = {
            status: true,
            message: 'Success',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }


        }else{
          try{
            const data = await Geolocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 8000,            
              maximumAge: Infinity
            });
            result = {
              status: true,
              message: 'Success',
              latitude: data.coords.latitude,
              longitude: data.coords.longitude
            }
          }catch(err){
            result = {status: false, message: 'Cannot get location'}
          }
        }
        return result
      },

      async getDeviceInfo(){
        const info = await Device.getId();
        const deviceInfo = await Device.getInfo();
        let data = {}
        data.os = getPlatforms().includes('android') ? 'android' : 'ios';
        data.model = deviceInfo.model;
        data.identifier = info.identifier;
        data.platform = deviceInfo.platform
        return data
      },

      async getUser() {
        try {
          const user = await storage.getItem('session-user');
          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      },
      async getAttlogs() {
        try {
          const logs = await storage.getItem('session-attlogs');
          if (logs) {
            return logs;
          } else {
            return [];
          }
        } catch (error) {
          return [];
        }
      },
      async UserLocation() {
        try {
          const loc = await storage.getItem('session-location');
          if (loc) {
            return loc;
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      },
      async getAppConfig() {
        try {
          const config = await storage.getItem('app-config');
          if (config) {
            return config;
          } else {
            return {};
          }
        } catch (error) {
          return {};
        }
      },
      async isWeb(){
        const deviceInfo = await Device.getInfo();
        if(!['android', 'ios'].includes(deviceInfo.platform)){
          return true
        }else{
          return false
        }
      },
      async validateSettings(){
        let res = {status: true, message: 'Success'}
        try {
          if(!this.isTimeAuto()){
            return res = {status: false, message: 'Set datetime settings to automatic'}
          }
        } catch (error) {
          return res = {status: false, message: 'Check your datetime settings'}
        }
        await this.checkperms()
        let data = this.checkTimeZone()
        if(!data.status){
          return  res = {status: false, message: data.message}
        }
        return res

      },
      formatDate(date){
        let year = date.substring(0, 4);
        let month = date.substring(5, 7)
        let day = date.substring(8, 10)
        return `${month}/${day}/${year}`
      },
      dateFormat(date){
        let year = date.substring(0, 4);
        let month = date.substring(5, 7)
        let day = date.substring(8, 10)
        return `${year}-${month}-${day}`
      },
      defaultDateFormat(date){
        let month = date.substring(0, 2);
        let day = date.substring(3, 5)
        let year = date.substring(6, 10)
        return `${year}-${month}-${day}`
      },
      dateModel(date) {
        const pad = (number) => (number < 10 ? '0' + number : number);
  
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1); // Months are zero-based
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
  
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      },
      computeDistance(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = (R * c) * 1000 ; // Distance in m
        return d;
      },
      deg2rad(deg) {
        return deg * (Math.PI/180)
      },
      async showAlert(data){
        const alert = await alertController.create({
          header: data.header,
          message: data.message,
          buttons: ['Okay'],
        });
        await alert.present();
      },
      async dataUrlToBlob(dataUrl){
        const arr = dataUrl.split(',');
        const mimeType = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new Blob([u8arr], { type: mimeType });
      },
      async compressImage(blob, quality) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              let originalWidth = img.width;
              let originalHeight = img.height;
              let maxSize = 650;  
              
              let newWidth, newHeight;
  
              if (originalWidth > originalHeight) {  // Landscape
                  let scaleFactor = maxSize / originalWidth;
                  newWidth = maxSize;
                  newHeight = parseInt(originalHeight * scaleFactor);
              } else {  // Portrait or square
                  let scaleFactor = maxSize / originalHeight;
                  newHeight = maxSize;
                  newWidth = parseInt(originalWidth * scaleFactor);
              }
  
              canvas.width = newWidth;
              canvas.height = newHeight;
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
              canvas.toBlob((compressedBlob) => {
                resolve(compressedBlob);
              }, 'image/jpeg', quality);
            };
            img.onerror = (error) => { reject(error) };
          };
          reader.onerror = (error) => { reject(error) };
          reader.readAsDataURL(blob);
        });
      },
      convertBlobToBase64(blob) {
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => { resolve(reader.result) };
        reader.onerror = (error) => { reject(error) };
        reader.readAsDataURL(blob);
      });
      },  
      generateUniqueId() {
        const now = new Date();
        const year = now.getFullYear();
        const month = ('0' + (now.getMonth() + 1)).slice(-2); // Months are zero based
        const day = ('0' + now.getDate()).slice(-2);
        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        const seconds = ('0' + now.getSeconds()).slice(-2);
        const miliseconds = ('00' + now.getMilliseconds()).slice(-3);
  
        return `${year}${month}${day}${hours}${minutes}${seconds}${miliseconds}`;
      },
    };
  }
};

export default MyFunctions;

