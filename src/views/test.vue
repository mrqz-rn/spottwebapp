<template>
<div>
    <IonCard class="pa-4 ma-4 mx-2" color="dark" style="border-radius: 25px;" >
        {{ location }}
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
    created(){
        try {
            navigator.permissions.query({name: "geolocation"})
            setInterval(() => {
                navigator.geolocation.getCurrentPosition((geo) => this.location = geo, (error) => console.log(error))
            }, 1500);
        } catch (error) {
            alert(error)
        }

        
    }
}
</script>
