import axios from 'axios';
import { CapacitorHttp } from '@capacitor/core';

const API_URL = 'https://ronmarquez.serv00.net/spott-api';
const DB_NAME = 'm10857_spottv2';
// const API_URL = 'http://localhost/spott-api';
// const DB_NAME = 'spottv2';
const API_TOKEN = 'U1BPVFRUT0tFTg=='


const MyApi = {
    install(app) {
        app.config.globalProperties.$api = {
            login: async (userData) => {
              const options = {
                url:`${API_URL}/admin/login`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: new URLSearchParams({
                  username: userData.username,
                  password: (userData.password),
                  device: userData.device,
                  TOKEN: API_TOKEN
                }).toString()
              }
              
              try {
                const timeout = (ms) => new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Request timed out')), ms)
                );
                const response = await Promise.race([
                  CapacitorHttp.post(options),
                  timeout(10000)
                ])
                return response.data;
              } catch (error) {
                return error
              }
            },

            savedata: async (userData) => {
              const options = {
                url:`${API_URL}/admin/crud`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: new URLSearchParams({
                  tableName: `${DB_NAME}.${userData.tableName}`,
                  fields: JSON.stringify(userData.fields),
                  key: JSON.stringify(userData.key),
                  TOKEN: API_TOKEN
                }).toString()
              }
              
              try {
                const timeout = (ms) => new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Request timed out')), ms)
                );
                const response = await Promise.race([
                  CapacitorHttp.post(options),
                  timeout(10000)
                ])
                return response.data;
              } catch (error) {
                return JSON.stringify(error);
              }
            },
            masterselect: async (userData) => {
              const options = {
                url:`${API_URL}/admin/masterselect`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: {
                  TOKEN: API_TOKEN,
                  table_name: `${DB_NAME}.${userData.table_name}`,
                }
              }
              if(userData.having){
                options.data.having = JSON.stringify(userData.having)
              }
              if(userData.fields){
                options.data.fields = JSON.stringify(userData.fields)
              }
              if(userData.order_by){
                options.data.order_by = JSON.stringify(userData.order_by)
              }
              options.data = new URLSearchParams(options.data).toString()
   
              
              try {
                const timeout = (ms) => new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Request timed out')), ms)
                );
                const response = await Promise.race([
                  CapacitorHttp.post(options),
                  timeout(10000)
                ])
                return response.data;
              } catch (error) {
                return JSON.stringify(error);
              }
            },
            fileUpload: async (userData) => {
              const options = {
                url:`${API_URL}/admin/base64Upload`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: new URLSearchParams({
                  TOKEN: API_TOKEN,
                  path_folder: userData.path_folder,
                  max_size: userData.max_size,
                  base64data: userData.base64data,
                  type: 'base64'
                }).toString()
              }
              
              try {
                const timeout = (ms) => new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Request timed out')), ms)
                );
                const response = await Promise.race([
                  CapacitorHttp.post(options),
                  timeout(7500)
                ])
                return response.data;   
              } catch (error) {
                throw error
              }
            },
            addressapi: async (userData) => {
              let url = `https://nominatim.openstreetmap.org/reverse?lat=${userData.latitude}&lon=${userData.longitude}&format=json`;
             const options = {
               url:`${url}`,
             }
             
             try {
               const timeout = (ms) => new Promise((_, reject) =>
                 setTimeout(() => reject(new Error('Request timed out')), ms)
               );
               const response = await Promise.race([
                 CapacitorHttp.get(options),
                 timeout(10000)
               ])
               return response.data;
             } catch (error) {
               return JSON.stringify(error);
             }
           },

      }
    }
};

export default MyApi;



