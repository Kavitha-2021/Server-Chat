<template>
  <div id="previewprofile" class="c_preview_prof">
    <span class="x-span" @click="onclose">X</span>
    <img id="previewimage" width="500" height="500"/>
    <button class="upload_butn" @click="selectedProfile">Upload</button>
  </div>
  <div class="outerprofile">
    <div style="border-right: 2px solid">
      <img :src="details.profile" class="prof_imag" />
      <div style="display: flex; flex-direction: column; padding: 0% 10%">
        <button
          id="b_1"
          class="profile_btnn profile_active"
          @click="activetab('b_1')"
        >
          My Profile
        </button>
        <button id="b_2" class="profile_btnn" @click="activetab('b_2')">
          Edit Profile
        </button>
        <button id="b_3" class="profile_btnn" @click="activetab('b_3')">
          Settings
        </button>
        <button id="b_4" class="profile_btnn" @click="activetab('b_4')">
          Change Password
        </button>
      </div>
    </div>
    <transition-group name="slide" mode="out-in">
    <div class="details_user" v-if="view">
      <label class="details_label">USERNAME</label>
      <label class="details_value">{{ details.username }}</label>
      <label class="details_label">EMAIL</label>
      <label class="details_value">{{ details.email }}</label>
      <label class="details_label">PHONE</label>
      <label class="details_value">{{ details.phone }}</label>
    </div>
    <div class="details_user" v-if="edit">
      <div style="display: flex; justify-content: center">
      <img :src="details.profile" style="width:200px; height: 200px; border-radius: 100px"/>
      <label for="pro_file" class="addbtnn" >+</label>
      <input type="file" id="pro_file" style="display: none; visibility: hidden" @input="onpreviewprofile"/>
      </div>
      <label class="details_label">Update Phone</label>
      <input class="edit_details" type="number" v-model="update.phone" />
      <label class="details_label">Update Email</label>
      <input class="edit_details" type="email" v-model="update.email" />
      <button class="update_btn" @click="onupdate">Update</button>
    </div>
    <div v-if="settings">
      <h1>Settings</h1>
    </div>
    <div v-if="password" class="outerpass">
      <div v-if="!n_pass" class="details_user" style="width: 70%; height: 70%" >
        <label class="details_label">Enter Old Password</label>
        <input class="edit_details" type="password" v-model="oldpass" />
        <button class="update_btn" @click="onverify">Verify</button>
      </div>
      <transition name="slide" >
      <div v-if="n_pass" style="width: 70%; height: 70%" class="details_user">
        <label class="details_label">New Password</label>
        <input class="edit_details" type="password" v-model="new_pass1" />
        <label class="details_label">Re-enter New Password</label>
        <input class="edit_details" type="password" v-model="new_pass2" />
        <button class="update_btn" @click="onpasswordupdate">Change</button>
      </div>
      </transition>
    </div>
    </transition-group>
  </div>
</template>

<script>
import axios from "axios";
/* eslint-disable */
export default {
  name: "Profile",
  props: {
    name: String,
  },
  data() {
    return {
      new_profile: "",
      oldpass: "",
      new_pass1: "",
      new_pass2: "",
      n_pass: false,
      details: "",
      view: true,
      edit: false,
      password: false,
      settings: false,
      update: {
        email: this.$store.state.user.email,
        phone: this.$store.state.user.phone,
      },
    };
  },
  created() {
    axios
      .get(`${this.$store.state.remoteurl}getbyusername/${this.name}`)
      .then((res) => {
        this.details = res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });
    },
  methods: {
    onclose() {
      var x_previewprofile = document.getElementById('previewprofile')
      x_previewprofile.style.display = "none"
    },
    onpreviewprofile(event) {
      if(event.target.files[0].type.toString().startsWith('image')) {
      this.new_profile = event.target.files[0]
      var previewprofile = document.getElementById('previewprofile')
      previewprofile.style.display = "flex"
      previewprofile.style.flexDirection = "column"
      previewprofile.style.alignItems = "center"
      previewprofile.style.justifyContent = "center"
      previewprofile.style.gap = "30px"
      var previewimage = document.getElementById('previewimage');
      previewimage.src = URL.createObjectURL(event.target.files[0])
      } else alert('Pls select an image')
    },
    selectedProfile() {
           var formdata = new FormData();
           formdata.append("username", this.$store.state.user.username); 
           formdata.append("profile", this.new_profile); 
           axios
          .post(`${this.$store.state.remoteurl}uploadprofile`, formdata, {
            header: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
              type: "formData",
            },
          })
          .then((res) => {
            if(res.data.status == "success") {
                this.$store.state.user.profile = URL.createObjectURL(this.new_profile)
                this.details.profile = URL.createObjectURL(this.new_profile)
                this.onclose();
            }
            console.log("axios", res);
          })
          .catch((err) => {
            console.log("axios", err);
          });
    },
    onpasswordupdate(event) {
        event.preventDefault();
        if(this.new_pass1 == this.new_pass2) {
           axios
          .post(`${this.$store.state.remoteurl}updatpassword`, {
            username: `${this.$store.state.user.username}`,
            newpassword: this.new_pass1
          })
          .then((res) => {
            if (res.data.status == "success") {
              alert("updated")
              this.new_pass1 = ''
              this.new_pass2 = ''
              this.n_pass = false
            } else console.log(res);
          })
          .catch((err) => {
            console.log(err);
          }); 
        } else('Both password must be Equal')
    },
    onverify(event) {
      event.preventDefault();
      if (this.oldpass != "") {
        axios
          .post(`${this.$store.state.remoteurl}login`, {
            username: this.$store.state.user.username,
            password: this.oldpass,
          })
          .then((res) => {
            if (res.data.status == "success") {
              this.n_pass = true;
            } else alert("Incorrect password");
            this.oldpass = "";
          })
          .catch((err) => {
            console.log(err);
          });
      } else alert("Must enter a value");
    },
    onupdate(event) {
      event.preventDefault();
      if (this.update.email != "" || this.update.phone) {
        axios
          .post(`${this.$store.state.remoteurl}updateuser`, {
            username: `${this.$store.state.user.username}`,
            phone: this.update.phone,
            email: this.update.email,
          })
          .then((res) => {
            if (res.data.status == "success") {
              alert("updated");
              if (this.update.phone) this.details.phone = this.update.phone;
              if (this.update.email) this.details.email = this.update.email;
            } else console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      } else alert("Fill all field");
    },
    activetab(id) {
      var ex_active = document.getElementsByClassName("profile_btnn");
      var e = 0;
      while (e < ex_active.length) {
        ex_active[e].classList.remove("profile_active");
        e++;
      }
      var active = document.getElementById(id);
      active.classList.add("profile_active");
      this.n_pass = false;
      this.view = false;
      this.edit = false;
      this.password = false;
      this.settings = false;
      if (id == "b_1") this.view = true;
      if (id == "b_2") this.edit = true;
      if (id == "b_3") this.settings = true;
      if (id == "b_4") this.password = true;
    },
  },
};
</script>

<style scoped>
.x-span {
  position: fixed;
  top: 20px;
  right: 20px;
  font-size: 30px;
  text-shadow: 0px 0px 10px black;
  cursor: pointer;
}

.upload_butn {
    font-size: 20px;
    padding: 10px;
    width: 30%;
    background-color: #00BCD4;
    border: none;
    color: white;
    font-family: math;
}

.c_preview_prof {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(36 35 35 / 79%);
}

.slide-enter-active {
  transition: all 0.5s ease-out;
}

.slide-leave-active {
  opacity: 0;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(30%);
  opacity: 0;
}

.addbtnn {
    color: white;
    font-size: 40px;
    position: fixed;
    top: 35%;
    right: 18%;
    background-color: #3395a9;
    padding: 0px 10px;
    border-radius: 50px;
    cursor: pointer;
}

.outerpass {
    display: flex;
    align-items: center;
    justify-content: center;
}

.outerprofile {
  background-color: white;
  display: grid;
  grid-template-columns: 40% 60%;
  overflow: hidden;
}

.prof_imag {
  width: 80%;
  height: 300px;
  margin: 9%;
  border: 1px solid dimgray;
  padding: 1%;
}

.profile_btnn {
  text-align: left;
  padding: 5%;
  font-size: 25px;
  font-family: math;
  border: none;
  background: transparent;
}

.profile_btnn:hover {
  background-color: aliceblue;
}

.profile_active {
  font-size: 30px;
  color: #2aa0d0;
  font-weight: bold;
}

.details_user {
  display: flex;
  flex-direction: column;
  padding: 10%;
  justify-content: center;
  gap: 5%;
}

.details_label {
  color: dimgray;
  font-size: 20px;
  font-family: "Aboreto";
  font-weight: bold;
}

.details_value {
  color: black;
  font-size: 25px;
  font-family: math;
  border-bottom: 1px solid dimgray;
}

.edit_details {
  padding: 2%;
  font-size: 20px;
  font-family: math;
}

.update_btn {
  padding: 2%;
  font-size: 20px;
  color: white;
  border: none;
  background-color: #3d8293;
  font-family: system-ui;
}
</style>