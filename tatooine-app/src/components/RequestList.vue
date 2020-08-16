<template>
<div class="saved-requests-area">
  <div v-if="!editMode">
    <div v-if="loading"><i class="fas fa-2x fa-circle-notch fa-spin"></i></div>
    <ul class="list-group">
      <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        v-for="(request, index) in savedRequests"
        v-bind:key="request.Name"
        v-bind:class="activeButtonIndex === index ? 'active' : ''"
        v-on:click="activeButtonIndex = index; activeRequest = request;">
        {{request.Name}}
        <span class="badge badge-pill">
          <i v-on:click="editMode=true; activeRequest = request;" class="far fa-edit"></i>
        </span>
      </li>
    </ul>
    <button v-on:click="submitSelectedRequest" id="execute-button" class="btn btn-primary">Execute</button>
  </div>
  <edit-request v-else v-bind:request="activeRequest" />
</div>
</template>

<script>
import EditRequest from './EditRequest.vue';

export default {
  components: {
    EditRequest
  },
  data: function() {
    return {
      activeButtonIndex: 0,
      activeRequest: {},
      savedRequests: [],
      loading: false,
      editMode: false
    }
  },
  computed: {
    activeTab: function(index) {
      return {
        'active':  index == this.activeButtonIndex
      }
    }
  },
  mounted: function () {
    this.getSavedRequests();

    this.$broadcaster.on('navToList', () => {
      this.editMode = false;
      this.getSavedRequests();
    });
  },
  methods: {
    getSavedRequests: function() {
      this.loading = true;
      this.$requestSvc.getSavedRequests(this.$http)
      .then(response => {
        this.loading = false;
        this.savedRequests = response;
        if (this.savedRequests && this.savedRequests.length > 0) {
          this.activeRequest = this.savedRequests[0];
        }
      });
    },
    submitSelectedRequest: function() {
      event.preventDefault();
      this.$broadcaster.emit('beginLoading', {});
      this.$requestSvc.submit(this.$http, this.activeRequest)
      .then(response => {
        this.$broadcaster.emit('executedRequest', response);
      });
    }
  }
}
</script>

<style>
.saved-requests-area {
  margin-top: 20px;
}
#execute-button {
  margin-top: 20px;
}
.list-group {
  max-height: 400px;
  overflow: auto;
}
.list-group-item {
  cursor: pointer;
}
</style>
