<template>
  <div :id="elementId()" v-if="robot">
    <h3>
      <span class="name" :class="{ editable: editing }" contenteditable="editing">Robot: {{ robot.robotId }}</span>
      <a href="#" @click.prevent="pullRobotInfo"><i class="material-icons" title="reload">cached</i></a>
      <!-- <router-link :to="{name: 'robotEdit', params: {id: id}}"><i class="material-icons">edit</i></router-link> -->
    </h3>
    <p>Public:
      <a href="#" v-show="robot.isPublic" @click.prevent="togglePublicAccess"><i class="material-icons" title="Public">check</i></a>
      <a href="#" v-show="!robot.isPublic" @click.prevent="togglePublicAccess"><i class="material-icons" title="Protected">close</i></a>
    </p>

    <div>
      <!-- search bar and useradd bar -->
      <h5>Users: <a href="#" v-show="!isAddingUser" @click.prevent="toggleAddingUser" title="Create a new member">+</a>
        <a href="#" v-show="isAddingUser" @click.prevent="addUserSubmit"><i class="material-icons" title="Save user">check</i></a>
        <a href="#" v-show="isAddingUser" @click.prevent="toggleAddingUser"><i class="material-icons" title="Cancel">close</i></a>
      </h5>
    </div>

    <div v-if="isAddingUser">
      <div class="row">
          Username(s):
          <div class="input-field inline">
            <input v-model="newUser.username" placeholder="user1, user2" type="text">
          </div>
      </div>

    </div>

    <table v-show="hasUsers" class="centered stripped highlight responsive-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Has Access</th>
          <th>Updated At</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in robot.users" :key="user.username">
          <td>{{ user.username }}</td>
          <td>
            <a href="#" v-if="user.hasAccess" @click.prevent="toggleUserAccess(user)"><i class="material-icons" title="true">check</i></a>
            <a href="#" v-else @click.prevent="toggleUserAccess(user)"><i class="material-icons" title="false">close</i></a>
          </td>
          <td>{{ user.updatedAt }}</td>
          <td>
            <i @click="deleteUser(user)" class="button material-icons" title="delete">delete</i>
          </td>
        </tr>
        <!-- <UserTableRow v-for="user in users" :key="user._id" :user="user"/> -->
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'robotPage',
  props: ['id'], // robot mongo id
  data() {
    return {
      editing: false,
      newUser: {
        username: '',
        hasAccess: true,
      },
      isAddingUser: false,
      isBulkAddingUser: false,
    }
  }, // end of data

  computed: {
    ...mapGetters(['getRobotByMongoId']),
    robot() {
      return this.getRobotByMongoId(this.id);
    },
    hasUsers() {
      return this.robot.users.length !== 0;
    },

    allowedUsers() {
      return this.robot.users.filter(u => u.hasAccess);
    }
  },

  async created() {
    this.pullRobotInfo();
  },

  methods: {
    ...mapActions(['updateRobot', 'fetchRobot', 'updateUserAccess']),

    // TODO refactor editable field to its own component
    async save() {
      this.toggleEditing();
    },

    resetNewUser() {
      this.newUser = {
        username: '',
        hasAccess: true,
      }
    },

    async pullRobotInfo() {
      return this.fetchRobot(this.id);
    },

    async addSingleUser(user) {
      console.log('adding user', user.username);
      return this.updateUserAccess({robotMongoId: this.id, user});
    },

    // handles add user form submission
    async addUserSubmit() {
      // if a single user or multiple
      const DELIMITER = ', ';
      if (this.newUser.username.includes(DELIMITER)) {
        let usernames = this.newUser.username.split(DELIMITER);
        let errors = [];
        for (let username of usernames) {
          try {
            await this.addSingleUser({username, hasAccess: true});
          } catch (e) {
            errors.push(e);
          }
        }
        if (errors.length) {
          console.error(errors);
          alert(errors.map(e => e.response.data));
        }
      } else {
        try {
          await this.addSingleUser(this.newUser);
        } catch (e) {
          console.error(e);
          alert(e.response.data);
        }
      }

      this.toggleAddingUser();
      this.resetNewUser();
    },

    async confirmDestroy() {
      if (confirm(`Are you use you want to delete ${this.robot.robotId}`)) {
        let robotName = this.robot.robotId;
        try {
          await this.deleteRobot(this.robot);
          this.$router.push({name: 'robots'});
          alert(`robot ${robotName} deleted.`);
        } catch (e) {
          console.error(e);
          alert(e.response.data);
        }
      }
    },

    cancelEditing() {
      this.resetFields();
      this.toggleEditing();
    },

    resetFields() {
      this.setValues({
        name: this.robot.robotId
      })
    },

    toggleEditing() {
      this.editing = !this.editing;
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
    },

    elementId() {
      return '_' + this.robot._id;
    },

    toggleAddingUser() {
      this.isAddingUser = !this.isAddingUser;
    },

    async togglePublicAccess() {
      this.robot.isPublic = ! this.robot.isPublic;
      try {
        await this.updateRobot(this.robot);
      } catch (e) {
        console.error(e);
        this.robot.isPublic = ! this.robot.isPublic;
      }
    },

    async toggleUserAccess(user) {
      try {
        await this.updateUserAccess({robotMongoId: this.id, user: {...user, hasAccess: !user.hasAccess}});
      } catch (e) {
        alert(`failed to update access for user ${user.username}`);
      }
    },

    async deleteUser(user) {
      if (!confirm(`Are you use you want to delete ${this.robot.robotId}`)) return;
      let users = [...this.robot.users];
      let uIndex = users.findIndex(u => u.username === user.username);
      users.splice(uIndex, 1);

      try {
        await this.updateRobot({...this.robot, users: users});
      } catch (e) {
        alert(`failed to remove user ${user.username}`);
      }
    }
  }
}
</script>

<style scoped>
  i.button {
    cursor: pointer;
    color: #039be5;
  }
</style>

