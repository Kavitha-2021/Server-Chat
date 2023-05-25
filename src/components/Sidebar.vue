<template>
  <div class="outerchat">
    <div>
      <div class="nameavatar">
        <div style="display: flex; gap: 7%; align-items: center">
        <img
          class="avatar"
          :src="$store.state.user.profile"
          width="80"
          height="80"
          style="border-radius: 50px"
          @click="onclickprofile()"
        />
        <div class="uname">
          <label>{{ $store.state.user.username.toUpperCase() }}</label>
          <label style="font-size: 17px" @click="onlogout">Logout</label>
        </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 7px">
          <!-- <div class="dot" ></div>
          <div class="dot" ></div>
          <div class="dot" ></div> -->
        </div>
      </div>
      <div id="searchtextdiv" class="searchtextdiv">
      <input
        class="searchtext"
        type="text"
        placeholder="Search Contacts here"
        v-model="searchtext"
        @input="onsearch"
        @focus="onfocussearch"
      />
      <button class="xclose" @click="xclose">X</button>
      </div>
      <div v-if="search.length &gt; 0" class="scroll">
        <div style="color:dimgrey; font-style:italic; font-family:math; padding: 10px 0px">Search results</div>
        <div
          class="each"
          v-for="(each, i) in search"
          :key="i"
          @click="onclickname(each)"
        >
          <img
            :src="each.profile"
            width="50"
            height="50"
            style="border-radius: 60px; border: 1px solid #69696945;"
          />
          <label style="font-size: 25px; font-family: system-ui; display: grid">
            {{each.username.charAt(0).toUpperCase()}}{{each.username.substring(1)}}
            <label class="l_msg fileimage" v-if="lastmessage[each.username]">
              <span v-if="lastmessage[each.username] && lastmessage[each.username].author == $store.state.user.username"  style="float: left; margin-right: 5px">
                <img v-if="lastmessage[each.username].status == 1" src="../assets/singletickwhite.png" width="20" height="25"/>
                <img v-else-if="lastmessage[each.username].status == 2" src="../assets/doubletickwhite.png" width="25" height="25" />
                <img v-else-if="lastmessage[each.username].status == 3" src="../assets/doubletickblue.png" width="25" height="25" />
              </span>
              <CIcon v-if="lastmessage[each.username].message == 'Photo'" :icon="cilCamera" width="20" height="20"/>
              <CIcon v-else-if="lastmessage[each.username].message == 'File'" :icon="cilDescription" width="20" height="20"/>
              {{lastmessage[each.username].message || 'Tap here to send message' }}</label>
            <label class="l_msg" v-else>{{ 'Tap here to send message' }}</label>
          </label>
        </div>
      </div>
      <div v-else-if="chats.length &gt; 0 && search.length == 0 && searchtext == '' " class="scroll">
        <div
          class="each"
          v-for="(each, i) in chats"
          :key="i"
          @click="onclickname(each); profile=false"
        >
          <img
            :src="each.profile"
            width="50"
            height="50"
            style="border-radius: 60px; border: 1px solid #69696945;"
          />
          <div class="name_unread">
            <label style="font-size: 25px; font-family: system-ui; display: grid">
            {{each.username.charAt(0).toUpperCase()}}{{each.username.substring(1)}}
            <label class="type-indicate" v-if="lastmessage[each.username] && lastmessage[each.username].typing">{{ 'typing...'}}</label>
            <label class="l_msg fileimage" v-if="lastmessage[each.username]">
              <span v-if="lastmessage[each.username] && lastmessage[each.username].author == $store.state.user.username"  style="float: left; margin-right: 5px">
                <img v-if="lastmessage[each.username].status == 1" src="../assets/singletickwhite.png" width="20" height="25"/>
                <img v-else-if="lastmessage[each.username].status == 2" src="../assets/doubletickwhite.png" width="25" height="25" />
                <img v-else-if="lastmessage[each.username].status == 3" src="../assets/doubletickblue.png" width="25" height="25" />
              </span>
              <CIcon v-if="lastmessage[each.username].message == 'Photo'" :icon="cilCamera" width="20" height="20"/>
              <CIcon v-else-if="lastmessage[each.username].message == 'File'" :icon="cilDescription" width="20" height="20"/>
              {{lastmessage[each.username].message || 'Tap here to send message' }}</label>
            <label class="l_msg" v-else>{{ 'Tap here to send message' }}</label>
          </label>
          <span class="unreadtag" v-if="$store.state.allunreadmessage[each.username] && $store.state.allunreadmessage[each.username].length &gt; 0">
            {{ $store.state.allunreadmessage[each.username].length }}
          </span>
          </div>
        </div>
      </div>
      <div v-else-if="search.length == 0 && searchtext != '' " class="scroll elsescroll" >
        <label  class="nocontact">No result for this search</label>
      </div>
      <div v-else class="scroll elsescroll"> 
        <label class="nocontact" >--No Contacts Found--</label>
        <label class="nocontact">You can search and add contact to your contact list</label>
      </div>
    </div>
    <Profile v-if="profile == true" :name="p_name" />
    <Chatbox :senduser="senduser" :profile="profile" :logout="islogout" @addchat="onaddchat"/>
  </div>
</template>

<script>
import { CIcon } from "@coreui/icons-vue";
import { cilDescription, cilCamera } from "@coreui/icons";

import axios from 'axios'
import Chatbox from "./Chatbox.vue";
import Profile from "./Profile.vue";
/* eslint-disable */
export default {
  name: "Sidebar",
  components: {
    Chatbox,
    CIcon,
    Profile,
  },
  data() {
    return {
      p_name: '',
      profile: false,
      socket: "",
      senduser: '',
      search: [],
      couser: [],
      chats: [],
      islogout: false,
      searchtext: '',
      cilDescription,
      cilCamera,
    };
  },
  computed: {
    lastmessage() {
      return this.$store.state.lastmessage
    }
  },
  created() {
    axios.get(`${this.$store.state.remoteurl}chats/${this.$store.state.user.username}`)
        .then(res => {
            this.chats = res.data.data
        }).catch(err => {
            console.log(err)
        })
    this.$store.dispatch('setLastmessage')
    this.$store.dispatch('setOfflineMessage')
  },
  methods: {
    onfocussearch() {
      var searchtextdiv = document.getElementById('searchtextdiv')
      searchtextdiv.style.border = "2px solid black"
    },
    onclickprofile() {
      this.p_name = this.$store.state.user.username
      this.profile = true
    },
    onclickname(user) {
      this.senduser = user;
    },
    onlogout() {
      this.islogout=true
      this.$router.push('/')
    },
    onsearch() {
      if(this.searchtext != '')
      {
      axios.get(`${this.$store.state.remoteurl}search/${this.$store.state.user.username}/${this.searchtext}`)
        .then(res => {
          this.search = res.data.data
          console.log(this.search)
        }).catch(err => {
          console.log(err)
        })
      }
    },
    xclose() {
      this.searchtext='';
      this.search = [];
      var x_searchtextdiv = document.getElementById('searchtextdiv')
      x_searchtextdiv.style.border = "1px solid #c6c0c0"
    },
    onaddchat() {
      axios.get(`${this.$store.state.remoteurl}chats/${this.$store.state.user.username}`)
        .then(res => {
            this.chats = res.data.data
            this.$store.dispatch('updateChat')
        }).catch(err => {
            console.log(err)
      })
    }
  },
};
</script>

<style scoped>
.outerchat {
    background-color: #7ecbe824;
    display: grid;
    grid-template-columns: 25% 74.4%;
    gap: 0.5%;
    padding: 0.2%;
    height: 99vh;
}

.nameavatar {
  padding: 3%;
  display: flex;
  align-items: center;
  gap: 5%;
  background-color: #0da5cc;
  justify-content: space-between;
}

.uname {
  font-size: 30px;
  font-family: Aboreto;
  display: flex;
  gap: 10px;
  flex-direction: column;
  font-weight: bold;
  text-shadow: 0 0 5px white;
}

.searchtext {
    padding: 5% 3%;
    font-size: 19px;
    font-family: system-ui;
    color: #273652;
    border: none;
}

.searchtext:focus {
    outline: none;
}

.each {
  display: flex;
  padding: 3%;
  align-items: center;
  gap: 15px;
  background-color: white;
  color: #273652;
  border-bottom: 1px solid #c5bfbf;
  margin-bottom: 1%;
}

.avatar {
  border-radius: 50px;
  border: 2px solid #348db5;
}

.scroll {
  height: 69%;
  overflow-y: scroll;
  padding-right: 10px;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #02020224;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.nocontact {
    color: dimgray;
    font-style: italic;
    font-family: math;
    text-align: center;
    font-size: 20px;
}

.elsescroll {
    text-align: center;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.searchtextdiv {
    margin: 2% 0px;
    background-color: white;
    border: 1px solid #c6c0c0;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    padding: 1%;
}

.xclose {
  border:none; 
  background-color:transparent;
  /* padding:3%; */
  font-size:22px;
  color: rgb(143, 142, 142);
}

.xclose:hover {
  color: black;
}

.l_msg {
  font-size: 17px; 
  font-family: system-ui; 
  color: dimgray; 
  height: 25px; 
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.fileimage {
  display: flex;
  gap: 5px; 
}

.dot {
    background-color: white;
    width: 10px;
    height: 10px;
    border-radius: 10px;
}

.unreadtag {
  padding: 7px 10px;
  background-color: mediumseagreen;
  color: white;
  border-radius: 50%;
  box-shadow: 0px 0px 5px green;
}

.name_unread {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
}

.type-indicate {
  position: absolute;
  top: 50%;
  font-size: 20px;
  color: #7ae414;
  font-weight: 600;
  background: white;
  width: 100%;
}
</style>