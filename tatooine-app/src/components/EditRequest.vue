<template>
<div>
  <request-form v-bind:request="request" />
  <button v-on:click="remove" class="btn btn-danger">Delete</button>
  <button v-on:click="update" style="float:right" class="btn btn-info">Update</button>
  <button v-on:click="goBack" style="float:right; margin-right: 10px;" class="btn btn-outline-secondary">Back</button>
</div>
</template>

<script>
import RequestForm from './RequestForm.vue';

export default {
  components: {
    RequestForm
  },
  props: ['request'],
  methods: {
    update: function() {
      event.preventDefault();
      this.$requestSvc.update(this.$http, this.request)
      .then(() => {
        this.$broadcaster.emit('navToList', {});
      });
    },
    remove: function() {
      event.preventDefault();
      if (!confirm(`Are you sure you want to delete [${this.request.Name}]?`)){
        return;
      }
      this.$requestSvc.remove(this.$http, this.request._id)
      .then(() => {
        this.$broadcaster.emit('navToList', {});
      });
    },
    goBack: function() {
      this.$broadcaster.emit('navToList',{});
    }
  }
}
</script>

<style>

</style>