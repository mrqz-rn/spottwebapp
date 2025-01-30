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
        try {
            // let loc = await navigator.permissions.query({ name: "geolocation" });
            // alert(loc.state);
            
            setInterval(async () => {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.location = position.coords
                    console.log(position.coords)
                    this.$forceUpdate()
                })


            }, 1500);
        } catch (error) {
            alert(error);
        }
    }

}
</script>
