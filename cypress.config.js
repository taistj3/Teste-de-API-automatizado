const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "huums3",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000/",
  },
});
