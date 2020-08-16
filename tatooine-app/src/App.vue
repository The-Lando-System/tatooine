<template>
  <div id="app">
    <div class="container-fluid">

      <div class="jumbotron jumbotron-fluid">
        <div class="container">
          <h1 class="display-4">Web Consumer</h1>
          <p class="lead">Submit web requests to various APIs and save them for later...</p>
          <div v-if="user">
            <p>Welcome, {{user.FullName}}</p>
          </div>
          <div v-else>
            <button v-on:click="login" class="btn btn-info">Login</button>
          </div>
        </div>
      </div>

      <div class="row">

        <div class="col-md-6">
          <request-area />
        </div>
        <div class="col-md-6">
          <results-area />
        </div>
        
      </div>

    </div>
  </div>
</template>

<script>
import RequestArea from './components/RequestArea.vue'
import ResultsArea from './components/ResultsArea.vue';

export default {
  name: 'app',
  components: {
    RequestArea,
    ResultsArea
  },
  data: function() {
    return {
      user: null
    }
  },
  mounted: function() {
    this.$authSvc.init().then(() => {
      this.$authSvc.initGoogleUser().then((user) => {
        this.user = user;
      });
    });
  },
  methods: {
    login: function() {
      event.preventDefault();
      this.$authSvc.login().then(() => {
        window.href = '/';
      });
    }
  }
}
</script>

<style>
  #app {
    margin: 20px;
  }
</style>
