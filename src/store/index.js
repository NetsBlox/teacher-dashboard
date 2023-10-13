import Vue from 'vue'
import Vuex from 'vuex'
import sandboxStore from '@/store/sandbox';
import roboscapeStore from '@/store/roboscape';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    SERVER_ADDRESS: window.localStorage.getItem('SERVER_ADDRESS') || 'http://localhost:5050',
    user: undefined,
    ...sandboxStore.state,
    ...roboscapeStore.state,
  },

  mutations: {
    setServerAddress(state, address) {
      state.SERVER_ADDRESS = address;
      window.localStorage.setItem('SERVER_ADDRESS', address);
    },
    ...sandboxStore.mutations,
    ...roboscapeStore.mutations,
  },

  getters: {
    ...sandboxStore.getters,
    ...roboscapeStore.getters,
  },

  actions: {
    ...sandboxStore.actions,
    ...roboscapeStore.actions,
  }
})

// TODO fetchRobots and updateRobot
