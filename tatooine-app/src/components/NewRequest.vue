<template>
<div>
  <request-form v-bind:request="request" />
  <button v-on:click="submit" class="btn btn-primary">Execute</button>
  <button v-on:click="save" style="float:right" class="btn btn-info">Save</button>
</div>
</template>

<script>
import RequestForm from './RequestForm.vue';

export default {
  components: {
    RequestForm
  },
  data: function() {
    return {
      request: {
        'Name':'My Request',
        'Url':'http://worldclockapi.com/api/json/est/now',
        'Method':'Get',
        'RequestBody':'',
        'AuthType':'None'
      }
    }
  },
  methods: {
    save: function() {
      event.preventDefault();
      this.request.RequestBody = this.requestBody;
      this.$requestSvc.save(this.$http, this.request)
      .then((response) => {
        this.$broadcaster.emit('savedRequest', response);
      });
    },
    submit: function() {
      event.preventDefault();
      this.$broadcaster.emit('beginLoading', {});
      if (this.requestBody){
        try {
          this.request.RequestBody = JSON.parse(this.requestBody);
        } catch(e) {
          return;
        }
      }

      this.$requestSvc.submit(this.$http, this.request)
      .then((response) => {
        this.$broadcaster.emit('executedRequest', response);
      });
    }
  }
}
</script>

<style>

</style>