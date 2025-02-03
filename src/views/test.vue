<template>
<div>
    <IonCard class="pa-4 ma-4 mx-2" color="dark" style="border-radius: 25px;" >
        {{ (location.longitude) }} : {{ (location.latitude) }}
    </IonCard>
</div>
</template>

<script>

import { IonCard } from '@ionic/vue';

export default {
    components: { IonCard },
    name: 'test',
    data(){
        return{
            location: {}
        }
    },
    async created() {
        let hasdata = await this.$function.checknet()
        console.log('test: ' + hasdata)
        try {
            // let loc = await navigator.permissions.query({ name: "geolocation" });
            // alert(loc.state);
           
            setInterval(async () => {
                const position = await new Promise((resolve, reject) =>
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                );
                this.location = {
                    status: true,
                    message: 'Success',
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }


            }, 1500);
        } catch (error) {
            alert(error);
        }
    }

}
</script>
