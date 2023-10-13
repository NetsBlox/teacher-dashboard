import Cloud from '@/libs/cloud'

export default  {
  data: function() {
    return {
      authenticator: new Cloud(this.$store.state.SERVER_ADDRESS),
    }; // end of data
  },

  computed: {
    user() { return this.$store.state.user }
  },
  methods: {

    // fetches and updates the user state
    async fetchUser() {
      // findout the login status and return it
      let user;
      try {
        user = await this.authenticator.getProfile()
      } catch (e) {
        console.error(e)
      }
      this.$store.state.user = user
      return user;
    },

    async logout() {
      console.log('logging out')
      await this.authenticator.logout()
      await this.fetchUser();
    }

  }
};

