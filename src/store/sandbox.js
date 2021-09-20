import axios from 'axios'

function findGroup(state, groupId) {
  // there is no access to getters in mutations
  return state.groups.find(g => g._id === groupId)
}

const userChangeableAttrs = ['username', 'email'],
  groupChangeableAttrs = ['name'];

export default {
  state: {
    groups: [],
  },

  mutations: {
    addGroup(state, group) {
      state.groups.push(group);
    },

    deleteGroup(state, group) {
      let targetIndex = state.groups.findIndex(g => g._id = group._id);
      state.groups.splice(targetIndex, 1);
    },

    patchGroup(state, group) {
      let targetGroup = findGroup(state, group._id);
      groupChangeableAttrs.forEach(attr => {
        if (group[attr] !== undefined) targetGroup[attr] = group[attr];
      })
    },

    setGroups(state, groups) {
      state.groups = groups;
    },

    updateGroup(state, group) {
      let targetGroup = findGroup(state, group._id);
      console.assert(targetGroup, 'group is missing');
      targetGroup.name = group.name;
      if (group.users) {
          targetGroup.users = group.users;
      }
      targetGroup.apiKeys = group.apiKeys || [];
      targetGroup.servicesHosts = group.servicesHosts || [];
    },

    setGroupData(state, payload) {
      const { groupId, users } = payload;
      const group = findGroup(state, groupId);
      group.users = users;
    },

    setGroupAPIKeys(state, payload) {
      const { groupId, apiKeys } = payload;
      const group = findGroup(state, groupId);
      group.apiKeys = apiKeys;
    },

    patchGroupAPIKey(state, apiKey) {
      const [groupId] = apiKey.groups;
      const { _id, value } = apiKey;
      let groupKeys = findGroup(state, groupId).apiKeys;
      let targetKey = groupKeys.find(u => u._id = _id);
      targetKey.value = value;
    },

    // update a single user
    // payload user should have a groupId
    patchGroupUser(state, user) {
      const { groupId, username } = user;
      let groupUsers = findGroup(state, groupId).users;
      let targetUser = groupUsers.find(u => u.username = username);
      userChangeableAttrs.forEach(att => {
        if (user[att] !== undefined) {
          targetUser[att] = user[att];
        }
      })
    },

    deleteGroupUser(state, user) {
      console.debug(`deleting ${user.username}`);
      let group = findGroup(state, user.groupId);
      let targetIndex = group.users.findIndex(u => u._id === user._id);
      group.users.splice(targetIndex, 1);
    },

    addGroupUser(state, user) {
      let group = findGroup(state, user.groupId);
      group.users.push(user);
    },

    addGroupAPIKey(state, apiKey) {
      const groupId = apiKey.groups[0];
      const group = findGroup(state, groupId);
      group.apiKeys.push(apiKey);
    },

    deleteGroupAPIKey(state, keyId) {
      state.groups.forEach(group => {
        const index = group.apiKeys.findIndex(key => key._id === keyId);
        if (index > -1) {
          console.log('removing key #' + index);
          group.apiKeys.splice(index, 1);
        }
      });
    },

    updateServicesHosts(state, data) {
      const {groupId, servicesHosts} = data;
      const group = findGroup(state, groupId);
      group.servicesHosts.splice(0, group.servicesHosts.length, ...servicesHosts)
    },

  },

  getters: {
    getGroupById(state) {
      return groupId => {
        return state.groups.find(g => g._id === groupId)
      }
    },

    getUserByUsername(state, getters) {
      return (groupId, username) => {
        return getters.getGroupById(groupId).users.find(u => u.username === username);
      }
    },

    getUserById(state, getters) {
      return (groupId, userId) => {
        return getters.getGroupById(groupId).users.find(u => u._id === userId);
      }
    },

    getUsers(state, getters) {
      return groupId => {
        console.log('getting users for', groupId);
        return getters.getGroupById(groupId).users;
      }
    },

  },

  actions: {
    // WARN probably shouldn't use the return values from actions as they are not a reference  to the store
    async fetchGroups(context) {
      const endpoint = context.state.SERVER_ADDRESS + '/api/groups'
      let { data: groups } = await axios.get(endpoint, {
        withCredentials: true,
      })
      context.commit('setGroups', groups);
      return groups;
    },

    async fetchGroup(context, groupId) {
      const endpoint = context.state.SERVER_ADDRESS + '/api/groups/' + groupId
      let { data: group } = await axios.get(endpoint, {
        withCredentials: true,
      })
      let existingGroup = findGroup(context.state, groupId);
      if (existingGroup) {
        context.commit('updateGroup', group);
      } else {
        context.commit('addGroup', group);
      }
      return group;
    },

    async fetchGroupMembers(context, groupId) { // gets group details
      if (!groupId || groupId.length !== 24) throw new Error('invalid group id', groupId);
      console.log('fetching users', groupId);
      const endpoint = context.state.SERVER_ADDRESS + `/api/groups/${groupId}/members`
      let { data: users } = await axios.get(endpoint, {
        withCredentials: true,
      })

      context.commit('setGroupData', {groupId, users });
    },

    async fetchGroupAPIKeys(context, groupId) {
      const apiKeysUrl = `${context.state.SERVER_ADDRESS}/services/keys`
      const { data: apiKeys } = await axios.get(apiKeysUrl, {
        withCredentials: true,
      })
      context.commit('setGroupAPIKeys', {groupId, apiKeys});
    },

    async createUser(context, user) {
      console.debug(`creating user ${user.username}`);
      if (!user || !user.username || !user.groupId || !user.email || !user.password) throw new Error(`missing user data, ${user.username}`);
      const endpoint = context.state.SERVER_ADDRESS + `/api/groups/${user.groupId}/members`
      let response = await axios.post(endpoint, user, {
        withCredentials: true
      })
      let createdUser = response.data;
      console.debug(`created user ${createdUser}`);
      console.assert(createdUser._id !== undefined, 'malformed user response');
      console.assert(createdUser.groupId !== undefined, 'malformed user response');
      console.assert(createdUser.username === user.username, 'malformed user response');
      context.commit('addGroupUser', createdUser);
      return createdUser;
    },

    async updateUser(context, user) {
      console.log(`updating user ${user.username}`);
      if (!user || !user.username || !user.email) throw new Error(`missing user data, ${user}}`);
      const endpoint = context.state.SERVER_ADDRESS + `/api/groups/${user.groupId}/members/${user._id}`;
      let response = await axios.patch(endpoint, user, {
        withCredentials: true
      })
      context.commit('patchGroupUser', user);
      return response.data;
    },

    async deleteUser(context, user) {
      console.log(`deleting user ${user.username}`);
      if (!user || !user.username || !user.email) throw new Error(`missing user data, ${user}}`);
      const endpoint = context.state.SERVER_ADDRESS + `/api/groups/${user.groupId}/members/${user._id}`;
      let response = await axios.delete(endpoint, {
        withCredentials: true
      })
      context.commit('deleteGroupUser', user);
      return response.data;
    },

    async setServicesHosts(context, data) {
      const {groupId, servicesHosts} = data;
      const endpoint = `${context.state.SERVER_ADDRESS}/api/v2/services-hosts/group/${groupId}`;
      const options = {withCredentials: true};
      await axios.post(endpoint, servicesHosts, options);
      context.commit('updateServicesHosts', data);
    },

    async deleteServicesHost(context, data) {
      const {groupId, servicesHost} = data;
      const group = findGroup(context.state, groupId);
      const index = group.servicesHosts.findIndex(host => {
        const sameCategories = servicesHost.categories
          .reduce((areSame, cat, index) => {
            return areSame && cat === host.categories[index];
          }, true);
        return sameCategories;
      });

      if (index > -1) {
        const servicesHosts = group.servicesHosts.slice();
        servicesHosts.splice(index, 1);
        const endpoint = `${context.state.SERVER_ADDRESS}/api/v2/services-hosts/group/${groupId}`;
        const options = {withCredentials: true};
        await axios.post(endpoint, servicesHosts, options);
        context.commit('updateServicesHosts', {groupId, servicesHosts});
      }
    },

    async createAPIKey(context, apiKey) {
      const {provider, value, groups} = apiKey;
      const endpoint = `${context.state.SERVER_ADDRESS}/services/keys/${provider}`;
      const options = {withCredentials: true};
      const response = await axios.post(endpoint, {value, groups}, options);
      const keyId = response.data;
      apiKey._id = keyId;
      context.commit('addGroupAPIKey', apiKey);
      return apiKey;
    },

    async updateAPIKey(context, apiKey) {
      const id = apiKey._id;
      const {value} = apiKey;
      const endpoint = `${context.state.SERVER_ADDRESS}/services/keys/`;
      const options = {withCredentials: true};
      const response = await axios.patch(endpoint, {id, value}, options);
      context.commit('patchGroupAPIKey', response.data);
      return response.data;
    },

    async deleteAPIKey(context, apiKey) {
      const keyId = apiKey._id;
      const endpoint = `${context.state.SERVER_ADDRESS}/services/keys/${keyId}`;
      let response = await axios.delete(endpoint, {
        withCredentials: true
      })
      context.commit('deleteGroupAPIKey', keyId);
      return response.data;
    },

    async updateGroup(context, group) {
      console.log(`updating group ${group.name}`);
      if (!group || !group.name) throw new Error(`missing group data, ${group}}`);
      const endpoint = context.state.SERVER_ADDRESS + `/api/groups/${group._id}`;
      let response = await axios.patch(endpoint, group, {
        withCredentials: true
      })
      context.commit('patchGroup', group);
      return response.data;
    },

    async deleteGroup(context, group) {
      console.log('deleting group', group.name);
      const endpoint = context.state.SERVER_ADDRESS + '/api/groups/' + group._id;
      let { data: resp } = await axios.delete(endpoint, {
        withCredentials: true
      })
      context.commit('deleteGroup', group);
      return resp;
    },

    async createGroup(context, name) {
      console.log('creating group', name);
      const endpoint = context.state.SERVER_ADDRESS + '/api/groups'
      let { data: group } = await axios.post(endpoint, {name: name}, {
        withCredentials: true
      })
      console.assert(group._id !== undefined, 'malformed group response');
      context.commit('addGroup', group);
      return group;
    },

  },
}
