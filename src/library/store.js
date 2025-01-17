import { createStore } from 'vuex';
import { Storage } from '@ionic/storage';

import { openDB } from 'idb';


const dbPromise = openDB('my.db', 1, {
  upgrade(db) {
    db.createObjectStore('attlogs', {
      keyPath: 'id',
      autoIncrement: true
    });
  },
});

const store = createStore({
  state: {
    database: null,
    attlogs: []
  },
  getters: {
    getattlogs: (state) => async (id) => {
      if (id === 'all') {
        return state.attlogs;
      } else if (id === 'range') {
        const sessionPayPeriod = await Storage.get({ key: 'session-payperiod' });
        const pp = JSON.parse(sessionPayPeriod.value);

        if (pp) {
          return state.attlogs.filter(e => {
            const trxdate = new Date(`${e.trxdate.substring(6, 10)}-${e.trxdate.substring(0, 2)}-${e.trxdate.substring(3, 5)}`);
            return trxdate >= new Date(pp.DATEFROM) && trxdate <= new Date(pp.DATETO);
          });
        } else {
          return state.attlogs;
        }
      } else {
        return state.attlogs.find(e => e.id === id);
      }
    },
    getlast: (state) => () => state.attlogs[0],
    getsavedlogs: (state) => () => state.attlogs.filter(e => e.upload_status === 0),
    getdb: (state) => () => state.database
  },
  mutations: {
    setDatabase(state, db) {
      state.database = db;
    },
    loadAttlogs(state, data) {
      state.attlogs = data;
    },
    saveAttlog(state, data) {
      state.attlogs.unshift(data);
    },
    updateAttlog(state, data) {
      const index = state.attlogs.findIndex(e => e.id === data.id);
      if (index !== -1) {
        state.attlogs[index].upload_status = data.upload_status;
        state.attlogs[index].uploaded_on = data.uploaded_on;
      }
    }
  },
  actions: {
    async init({ commit }, data) {
      const db = await dbPromise;
      commit('setDatabase', db);

      if (data === 'home') {
        console.log('home');
        const sessionUser = await Storage.get({ key: 'session-user' });
        await this.dispatch('load', sessionUser.value);
      } else {
        await this.dispatch('clearDB', data);
      }
    },
    async load({ state, commit }, username) {
      const tx = state.database.transaction('attlogs', 'readonly');
      const store = tx.objectStore('attlogs');
      const allAttlogs = await store.getAll();

      const userAttlogs = allAttlogs.filter(log => log.username === username);
      commit('loadAttlogs', userAttlogs);
    },
    async save({ state, commit }, data) {
      const tx = state.database.transaction('attlogs', 'readwrite');
      const store = tx.objectStore('attlogs');
      const id = await store.add(data);

      data.id = id;
      commit('saveAttlog', data);
    },
    async update({ state, commit }, data) {
      const tx = state.database.transaction('attlogs', 'readwrite');
      const store = tx.objectStore('attlogs');
      await store.put(data);

      commit('updateAttlog', data);
    },
    async clearDB({ state }, data) {
      const tx = state.database.transaction('attlogs', 'readwrite');
      const store = tx.objectStore('attlogs');
      await store.clear();

      const attlogs = data.attlogs.slice(0, 15);
      for (const log of attlogs) {
        await this.dispatch('save', log);
      }
    }
  }
});

export default store;
