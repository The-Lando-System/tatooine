import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App.vue';
import Broadcaster from './services/Broadcaster.js';
import RequestService from './services/RequestService.js';
import AuthService from './services/AuthService.js';

// Define global services on the Vue application
Object.defineProperty(Vue.prototype, '$broadcaster', { value: Broadcaster });
Object.defineProperty(Vue.prototype, '$requestSvc', { value: RequestService });
Object.defineProperty(Vue.prototype, '$authSvc', { value: AuthService });

Vue.config.productionTip = false;
Vue.use(VueResource);

Vue.http.interceptors.push((request, next) => {
  request.headers.set('Authorization', sessionStorage.getItem("access-token"));
  request.headers.set('Accept', 'application/json');
  next();
});

new Vue({
  render: h => h(App)
}).$mount('#app')
