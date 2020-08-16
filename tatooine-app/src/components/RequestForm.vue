<template>
<form class="web-request-form">
  <div class="form-group">
    <label for="name-input">Name</label>
    <input v-model="request.Name" type="text" class="form-control" id="name-input" placeholder="Name your request">
  </div>
  <div class="form-group">
    <label for="url-input">URL</label>
    <input v-model="request.Url" type="text" class="form-control" id="url-input" placeholder="https://example.com">
  </div>
  <div class="form-group">
    <label for="method-input">Request Method</label>
    <select v-model="request.Method" id="method-input" class="custom-select">
      <option value="Get">Get</option>
      <option value="Post">Post</option>
    </select>
  </div>
  <div v-if="request.Method === 'Post'" class="form-group sub-group">
    <label for="body-input">Body</label>
    <textarea v-model="request.RequestBody" class="form-control" id="body-input" rows="5" placeholder="{some:json}" />
  </div>
  <div class="form-group">
    <label for="auth-input">Authentication</label>
    <select v-model="request.AuthType" id="auth-input" class="custom-select">
      <option value="None">None</option>
      <option value="OAuth2">OAuth 2</option>
    </select>
  </div>
  
  <!-- Auth Inputs -->
  <div v-if="request.AuthType === 'OAuth2'" class="form-group sub-group">
    <label for="authurl-input">Auth URL</label>
    <input v-model="request.AuthUrl" type="text" class="form-control" id="authurl-input" placeholder="https://example.com">
  </div>
  <div v-if="request.AuthType === 'OAuth2'" class="form-group sub-group">
    <label for="apikey-input">API Key</label>
    <input v-model="request.ApiKey" type="text" class="form-control" id="apikey-input" placeholder="Api Key">
  </div>
  <div v-if="request.AuthType === 'OAuth2'" class="form-group sub-group">
    <label for="apisecret-input">API Secret</label>
    <input v-model="request.ApiSecret" type="text" class="form-control" id="apisecret-input" placeholder="Api Secret">
  </div>
</form>
</template>

<script>
export default {
  props: ['request']
}
</script>

<style>
.web-request-form {
  margin-top: 20px;
}
.sub-group {
  margin-left: 30px;
}
</style>