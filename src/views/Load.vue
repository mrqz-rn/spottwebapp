<template>
    <ion-page style="display: flex; justify-content: center; align-items: center; background-color: whitesmoke;">
        <div class="loader" :class="color"></div>
        <div :class="message ? 'animate__animated animate__bounceIn' : 'animate__animated animate__bounceOut' "
        style="color: black; position: absolute; bottom: 15vh;">
        <span style="font-weight: 600;">{{message}}</span> 
        </div>
    </ion-page>
</template>

<script>
import { IonPage } from '@ionic/vue';

export default {
    components: { IonPage },
    data(){
        return{
            message: 'Please wait...',
            color: 'color1'
        }
    },
    mounted() {
        let id = 1;
        let intervalId = setInterval(() => {
        id++;
        this.color = 'color' + id;
        if(id == 4){ id = 0; }
        }, 500);
        setTimeout(() => clearInterval(intervalId), 25000);
    }
}
</script>



<style>
ion-spinner {
    width: 60px;
    height: 60px;
  }
  .loader {
  width: 45px;
  aspect-ratio: 1;
  --_g: no-repeat radial-gradient(farthest-side,#205400 80%,#0000);
  background:
    var(--_g) 0    0,
    var(--_g) 100% 0,
    var(--_g) 100% 100%,
    var(--_g) 0    100%;
  background-size: 38% 38%;
  animation: l38 .4s infinite; 
}
@keyframes l38 {
  100% {background-position: 100% 0,100% 100%,0 100%,0 0}
}
.color1{
  --_g: no-repeat radial-gradient(farthest-side,#205400 80%,#0000);
}
.color2{
  --_g: no-repeat radial-gradient(farthest-side,#003ea8 80%,#0000);
}
.color3{
  --_g: no-repeat radial-gradient(farthest-side,#ad1a03 80%,#0000);
}
.color4{
  --_g: no-repeat radial-gradient(farthest-side,#d1af02 80%,#0000);
}




.loader2 {
  width: 35px;
  aspect-ratio: 1;
  --_g: no-repeat radial-gradient(circle closest-side,#205400 80%,#0000);
  background: 
    var(--_g) 0    0,
    var(--_g) 0    100%,
    var(--_g) 100% 100%;
  background-size: 40% 40%;
  animation:l11 1s infinite linear;
}
.loader3 {
  width: 35px;
  aspect-ratio: 1;
  --_g: no-repeat radial-gradient(circle closest-side,#205400 80%,#0000);
  background: 
    var(--_g) 0    0,
    var(--_g) 0    100%,
    var(--_g) 100% 100%;
  background-size: 40% 40%;
  animation:l11 1s infinite linear;
}
@keyframes l11 {
    25% {background-position:100% 0   ,0 100%,100% 100%}
    50% {background-position:100% 0   ,0 0   ,100% 100%}
    75% {background-position:100% 0   ,0 0   ,0    100%}
    100%{background-position:100% 100%,0 0   ,0    100%}
}
</style>
