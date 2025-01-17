<template>
<IonPage>
   
    <Login v-if="app.status && !app.user"/>
    <Update v-else-if="app.status && !app.user && app.update"/>
    <Maintenance v-else-if="app.status && !app.user && app.maintenance"/>
    <Load v-else/>
      
   
</IonPage>
</template>

<script>
import { IonPage } from '@ionic/vue';
import Load from './Load.vue';
import Login from './Login.vue';
import Update from './Update.vue';
import Maintenance from './Maintenance.vue';


export default {
    components: { IonPage,Load,Login,Update,Maintenance },
    data(){
        return{
            APP_VERSION: '1.2.8',
            app: {
                status: false,
                user: false,
                update: false,
                maintenance: false,
            },
            loaded: false,

        }
    },
    async created(){
        let net = await this.$function.getNet();
        let user = await this.$function.getUser();
        let hasnet = await this.$function.checknet();

        
        if(user){
            this.app.status = true
            this.app.user = true
            if(net.connected && hasnet){
                let appres = await this.checkAppConfig();
                if(appres.version != this.APP_VERSION){
                    this.app.update = true
                }else if(appres.onMaintenance == 1){
                    this.app.maintenance = true
                } else {
                    let check = await this.checkUser(user);
                    if(check.forceLogout == 1){
                        await this.$storage.removeItem('session-user');
                        this.app.status = true
                        this.app.user = false
                    } else if(check.updateConfig == 1){
                        check.updateConfig = 0
                        await this.$storage.setItem('session-user', (check));
                    } else {
                        this.app.status = true
                        this.app.user = true
                    }
                }
            }
        }else{
            this.app.status = true
            this.app.user = false
        }
        if(this.app.status && this.app.user && !this.app.update && !this.app.maintenance){
            this.$router.push('dashboard')
        }

    },
    methods: {
        async checkUser(data){
            let res = await this.$api.masterselect({
                table_name: 'spottv2.users_view',
                having: {
                    username: data.username
                }
            })
            await this.$api.savedata({
                tableName: 'spottv2.user_config',
                fields: {
                    userID: res[0].ID,
                    updateConfig: 0,
                    forceLogout: 0
                },
                key: ['userID']
            })
            return res[0]
        },
        async checkAppConfig(data){
            let res = await this.$api.masterselect({
                table_name: 'spottv2.app_config',
            })
            return res[0]
        }
    }
}
</script>


