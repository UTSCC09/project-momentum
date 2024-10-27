<script setup lang="ts">
import { ref } from 'vue';

const urlParams = new URLSearchParams(window.location.search);
const google_token = urlParams.get('google_token');

if (google_token){
  sessionStorage.setItem('google_token', google_token);
}

const microsoft_token = urlParams.get('microsoft_token');

if (microsoft_token){
  sessionStorage.setItem('microsoft_token', microsoft_token);
}

function login() {
  fetch('http://localhost:3000/api/oauth/google/signin', {
    method: 'POST',
  })
  .then(response => response.json())
  .then(data => {window.location.href = data.url;})
}

function login2() {
  fetch('http://localhost:3000/api/oauth/microsoft/signin', {
    method: 'POST',
  })
  .then(response => response.json())
  .then(data => {window.location.href = data.url;})
}

let username = ref('email');

function getuser() {
  fetch(`http://localhost:3000/api/oauth/google/user?google_token=${sessionStorage.getItem('google_token')}`, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    username.value = data.email;
  })
}

let username2 = ref('email');

function getuser2() {
  fetch(`http://localhost:3000/api/oauth/microsoft/user?microsoft_token=${sessionStorage.getItem('microsoft_token')}`, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    username2.value = data.displayName;
  })
}

</script>

<template>
  <button @click=login>login google</button>
  <button @click=login2>login microsoft</button>

  <button @click=getuser>{{ username }}</button>
  <button @click=getuser2>{{ username2 }}</button>
</template>

<style scoped>
</style>
