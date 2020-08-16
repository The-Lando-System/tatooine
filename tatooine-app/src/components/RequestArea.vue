<template>
<div class="web-request-card">

  <ul class="nav nav-tabs">
    <li class="nav-item">
      <a href="javascript:void(0);" v-on:click="formMode = true" v-bind:class="{'active':formMode}" class="nav-link">New Request</a>
    </li>
    <li class="nav-item">
      <a href="javascript:void(0);" v-on:click="formMode = false" v-bind:class="{'active':!formMode}" class="nav-link">Saved Requests</a>
    </li>
  </ul>

  <div v-if="formMode">
    <new-request/>
  </div>
  
  <div v-else>
    <request-list />
  </div>

</div>
</template>

<script>
import NewRequest from './NewRequest.vue';
import RequestList from './RequestList.vue';

export default {
  components: {
    NewRequest,
    RequestList
  },
  data: function() {
    return {
      formMode: true
    }
  },
  mounted: function() {
    this.$broadcaster.on('savedRequest', () => {
      this.formMode = false;
    });
  }
}

</script>

<style>
  .web-request-card {
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 20px;
    border: solid 0.5px #e2e1e0;
    border-radius: 2px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    min-height: 400px;
  }
  .web-request-card .nav-item {
    cursor: pointer;
  }
  .active {
    font-weight: bold;
  }
  .nav-item > a {
    color: black;
  }
</style>
