<template>
  <div class="inline-inputs" :id="elementId()">
    <div>
      email:
      <span class="email" :contenteditable="editing">{{ user.email }}</span>
    </div>
    <div>
      username:
      <span class="username" :contenteditable="editing">{{ user.username }}</span>
    </div>
    <div v-if="isNewUser" >
      password:
      <span class="password" :contenteditable="editing">{{ user.password }}</span>
    </div>
    <a href="#" v-if="editing" @click.prevent="save"><i class="material-icons" title="Save">check</i></a>
    <a href="#" v-if="editing" @click.prevent="cancelEditing"><i class="material-icons" title="Cancel">close</i></a>
    <a href="#" v-else @click.prevent="toggleEditing"><i class="material-icons" title="Edit">edit</i></a>
    <a href="#" @click.prevent="deleteUserConfirm()"><i class="material-icons" title="Delete">delete</i></a>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'user',
  props: ['user', 'groupId'],
  data() {
    return {
      editing: false,
    }
  },

  computed: {
    isNewUser() {
      return this.user._id === undefined;
    },
  },

  methods: {
    ...mapActions(['deleteUser', 'updateUser', 'createUser']),
    async deleteUserConfirm() {
      if (confirm(`are you sure you want to delete user ${this.user.username}?`)) {
        try {
          return await this.deleteUser(this.user);
        } catch (e) {
          console.error(e.response.data);
          const message = e.response.data.length > 1 ?
            `Could not delete user because of the following errors:\n${e.response.data.join('\n')}` :
            `Could not delete user: ${e.response.data[0]}`;
          alert(message);
        }
      }
    },

    toggleEditing() {
      this.editing = !this.editing;
    },

    cancelEditing() {
      this.resetFields();
      this.toggleEditing();
    },

    resetFields() {
      this.setValues({
        email: this.user.email,
      });
    },

    async save() {
      this.toggleEditing();
      try {
        if (this.isNewUser) {
          let userValues = {...this.user, ...this.readValues(['username', 'email', 'password'])};
          await this.createUser(userValues);
        } else {
          let userValues = {...this.user, ...this.readValues(['email'])};
          await this.updateUser(userValues);
        }
      } catch (e) {
        // revert html values back?
        this.resetFields();
        console.error(e);
        alert('failed to save user', e.response.data);
      }
    },

    elementId() {
      return '_' + this.user._id;
    },

    setValues(keyVals) {
      for (let key in keyVals) {
        document.querySelector(`#${this.elementId()} .${key}`).innerText = keyVals[key];
      }
    },

    readValues(keys) {
      let keyVals = {};
      keys.forEach(key => {
        keyVals[key] = document.querySelector(`#${this.elementId()} .${key}`).innerText.trim();
      });
      return keyVals;
    }
  }
}
</script>

<style>
.inline-inputs div {
  display: inline;
}
</style>
