<template>
    <div class="outersign">
        <div class="signupform">
            <!-- <label class="nameapp">SIGNUP</label> -->
            <form style="display: grid; gap: 30px">
                <div style="display: flex; flex-direction: column; align-items: center;" > 
                    <img id="imagetag" src="../assets/avatar-profile.avif" width="200" height="200" style="border-radius: 50%;" />
                    <label for="profile_image" class="addbtnnsign">+</label>
                    <input id="profile_image" type="file" style="display: none; visibility: hidden" @input="onselectprofile" />
                </div>
                <div style="display: flex; flex-direction: column; gap: 20px"> 
                    <input class="name" type="text" placeholder="Username" v-model="signdata.username"/>
                    <input class="name" type="text" placeholder="Password" v-model="signdata.password"/>
                    <input class="name" type="number" placeholder="Phone" v-model="signdata.phone"/>
                    <input class="name" type="email" placeholder="Email" v-model="signdata.email"/>
                </div>
            </form>
            <button class="signup-button"  @click="onsignup">Signup</button>
            <label style="text-align:center">Back to <router-link to="/">Login</router-link></label>
        </div>
</div>
</template>

<script>
import axios from 'axios'
/* eslint-disable */ 

export default {
    name: 'Signup',
    data() {
        return {
            signdata: {
                username: '',
                password: '',
                phone: 91,
                profile: '',
                email: '',
            }
        }
    },
    methods: {
        onselectprofile(event) {
            if(event.target.files[0].type.toString().startsWith('image')) {
            this.signdata.profile = event.target.files[0]
            var imagtag = document.getElementById('imagetag');
            imagtag.setAttribute('src', URL.createObjectURL(event.target.files[0]) )
            } else alert('Pls select an image')
        },
        onsignup(event) {
            event.preventDefault();
            if( (this.signdata.username != '') && (this.signdata.password != '') && (this.signdata.profile != '') && (this.signdata.email != '') ) {
                var formdatasign = new FormData();
                formdatasign.append("username", this.signdata.username)
                formdatasign.append("password", this.signdata.password)
                formdatasign.append("email", this.signdata.email)
                formdatasign.append("phone", this.signdata.phone)
                formdatasign.append("profile", this.signdata.profile)
                axios.post(`${this.$store.state.remoteurl}signup`, formdatasign, {
                    header: {
                    "Content-Type": "multipart/form-data",
                    Accept: "application/json",
                    type: "formData",
                    },
                })
                .then(res => {
                    if(res.data.status == 'success') {
                    this.$store.commit('setUser', res.data.data)
                    alert('Signup success')
                    this.$router.push('sidebar');
                    } else alert(res.data.message)
                }).catch(err => {
                    console.log(err)
                })
            } else alert('Fill all field')
        }
    }
}
</script>

<style scoped>

.signup-button {
    padding: 10px 10px;
    font-size: 20px;
    font-family: system-ui;
    border-radius: 10px;
    border: none;
    background-color: #0DA5CC;
    color: white;
    font-weight: bold;
}

.outersign {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.signupform {
    display: flex;
    flex-direction: column;
    gap: 6%;
    justify-content: center;
    width: 30%;
    height: 75%;
    padding: 50px;
    border-radius: 20px;
    box-shadow: 0px 0px 10px black;
    background-color: #273652;
}

.nameapp {
    font-size: 40px;
    font-family: Aboreto;
    font-weight: bold;
    text-shadow: 0 0 10px #c7d0d8;
    text-align: center;
}

.name {
    padding: 12px;
    font-size: 20px;
    font-family: math;
    border-radius: 10px;
    border: none;
}

.name:focus {
    outline: none;
}

.signupbtn {
    padding: 11px;
    font-size: 20px;
    border-radius: 12px;
    border: none;
    background-color: #0DA5CC;
    color: white;
    font-weight: bold;
}

a {
    text-decoration: none;
    color: #0DA5CC;
    font-weight: bold;
}

.addbtnnsign {
    color: white;
    font-size: 40px;
    position: fixed;
    top: 31%;
    right: 45%;
    background-color: #0DA5CC;
    padding: 0px 10px;
    border-radius: 50px;
    cursor: pointer;
}
</style>