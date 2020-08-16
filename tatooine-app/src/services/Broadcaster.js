export default {

  events: {},

  on(key, callback) {
    if (!this.events.hasOwnProperty(key)) {
      this.events[key] = [];
    }
    this.events[key].push(callback);
  },

  emit(key, data) {
    if (this.events.hasOwnProperty(key)) {
      this.events[key].forEach((callback) => {
        callback(data);
      });
    }
  }
}