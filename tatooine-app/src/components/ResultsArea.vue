<template>
  <div class="results">
    <div class="result-status-pane">
      <div class="row">
        <div class="col-sm-4">
          <span><b>Status: </b></span>
          <span v-bind:class="responseStatus">{{response.Status || "N/A"}}</span>
        </div>
        <div class="col-sm-7">
          <span><b>Content Type: </b></span>
          <span>{{response.ContentType || "N/A"}}</span>
        </div>
        <div class="col-sm-1">
          <i v-on:click="clearResults" id="clear-icon" class="fas fa-times"></i>
        </div>
      </div>
    </div>
    <div ref="resultsPane" class="result-data-pane">
      <div v-if="loading" class="loading"><i class="fas fa-2x fa-circle-notch fa-spin"></i></div>
      <pre id="parsed-results-pre">Parsed Result: {{response.ParsedData}}</pre>
      <pre id="results-pre">{{response.Data}}</pre>
      <iframe id="results-iframe"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      response: {},
      isHtml: false,
      loading: false,
    }
  },
  computed: {
    responseStatus: function () {
      return {
        'ok': this.response.Status === 'OK',
        'warn': this.response.Status === 'BadRequest'
             || this.response.Status === 'NotFound'
             || this.response.Status === 'MethodNotAllowed'
      }
    }
  },
  mounted: function() {
    this.$broadcaster.on('executedRequest', (data) => {

      this.loading = false;

      this.response = data;

      var iframe = this.$refs.resultsPane.querySelector("#results-iframe");
      
      if (this.response.ContentType.includes('text/html')) {
        
        var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
        iframedoc.body.innerHTML = this.response.Data;
        this.response.Data = '';

        iframe.style.display = 'initial';
      } else {
        iframe.style.display = 'none';
      }

    });

    this.$broadcaster.on('beginLoading', () => {
      this.clearResults();
      this.loading = true;
    });
  },
  methods: {
    clearResults: function() {
      this.response = {};
      var iframe = this.$refs.resultsPane.querySelector("#results-iframe");
      iframe.style.display = 'none';
    }
  }
}
</script>

<style>
.ok {
  color: #87bc87;
}

.warn {
  color: #e1bb49;
}

.results {
  margin-top: 10px;
  margin-bottom: 10px;
}

.result-status-pane {
  text-align: left;
  padding: 20px;
  border: solid 0.5px #e2e1e0;
  border-radius: 2px;
  margin-bottom: 10px;
}

.result-data-pane {
  text-align: left;
  padding: 20px;
  border: solid 0.5px #e2e1e0;
  border-radius: 2px;
  max-height: 400px;
  height: 400px;
  overflow: auto;
}

#results-iframe {
  display: none;
  height: 90%;
  width: 100%;
}

#clear-icon {
  cursor: pointer;
}

.loading {
  text-align: center;
}

#results-pre {
  overflow: unset;
}

#parsed-results-pre {
  overflow: unset;
}

</style>
