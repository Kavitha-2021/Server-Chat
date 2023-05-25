<template>
<div class="outerchat">
    <form class="loginform">
        <label class="nameapp">CHAT APP</label>
        <input class="username" type="text" placeholder="Username" v-model="logindata.username"/>
        <input class="username" type="text" placeholder="Password" v-model="logindata.password"/>
        <button class="loginbtn" @click="onlogin">Login</button>
        <label style="text-align:center">Don't have an account <router-link to="/signup">Signup!</router-link></label>
    </form>
</div>
</template>

<script>
import { CIcon } from '@coreui/icons-vue';
import { cilCommentBubble } from '@coreui/icons';
import axios from 'axios';

/* eslint-disable */ 
export default {
   name: 'Home',
   components: {
    CIcon,
   },
   data() {
    return {
        cilCommentBubble,
        logindata: {
            username: '',
            password: '',
        }
    }
   },
   methods: {
    onlogin(event) {
        event.preventDefault();
        if( (this.logindata.username != '') && (this.logindata.password != '') ) {
            axios.post(`${this.$store.state.remoteurl}login`, this.logindata)
                .then(res => {
                    if(res.data.status == 'success') {
                    this.$store.commit('setUser', res.data.data)
                    alert('login success')
                    this.$router.push('sidebar');    
                    } else alert(res.data.message)
                }).catch(err => {
                    console.log(err)
                })
        } else alert('Fill all fields')
    }
   }
}
</script>

<style scoped>

.loginform {
    display: flex;
    flex-direction: column;
    gap: 10%;
    justify-content: center;
    width: 30%;
    height: 60%;
    padding: 50px;
    border-radius: 20px;
    box-shadow: 0px 0px 10px black;
    background-color: #273652;
}

.username {
    padding: 12px;
    font-size: 20px;
    font-family: math;
    border-radius: 10px;
    border: none;
}

.username:focus {
    outline: none;
}

.nameapp {
    font-size: 40px;
    font-family: Aboreto;
    font-weight: bold;
    text-shadow: 0 0 10px #c7d0d8;
    text-align: center;
}

.outerchat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.loginbtn {
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
</style>