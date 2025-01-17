

import { Storage } from '@ionic/storage';
const storage = new Storage();
let storageInstance = null;


const MyStorage = {
    install(app) {
        app.config.globalProperties.$storage = {
            async initStorage() {
                storageInstance = await storage.create();
            },
            async setItem(key, value) {
                await storageInstance.set(key, JSON.stringify(value));
            },

            async getItem(key) {
                return JSON.parse(await storageInstance.get(key));
            },
            async removeItem(key) {
                await storageInstance.remove(key);
            },
            async clearStorage() {
                await storageInstance.clear();
            },
            async pushAttlogs(data){
                let attlogs = [];
                let session = JSON.parse(await storageInstance.get('session-attlogs'))
                if(session != null){
                    if(session.length > 1){
                        attlogs = session    
                    }else{
                        attlogs.push(session[0]);
                    }
                }
                attlogs.push(data);
                await storageInstance.set('session-attlogs', JSON.stringify(attlogs));
            },
            async updateAttlogs(data){
                let attlogs = [];
                let session = JSON.parse(await storageInstance.get('session-attlogs'))
                let uploaded = data;
                if(session != null){
                    if(session.length > 1){ attlogs = session }
                    else{ attlogs.push(session[0]) }
                }
               
                let attlogIndex = attlogs.findIndex(log => log.id == uploaded.id);
                if (attlogIndex != -1) {
                  attlogs[attlogIndex].upload_status = 1;
                  attlogs[attlogIndex].uploaded_on = new Date();
                }
                await storageInstance.set('session-attlogs', JSON.stringify(attlogs));
            }
            
        };
    }
};

export default MyStorage;
