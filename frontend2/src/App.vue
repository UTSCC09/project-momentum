<script setup lang="ts">

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token){
  console.log(token);
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

</script>

<template>
  <button @click=login>Click me</button>

  <button @click=login2>Click me</button>
</template>

<style scoped>
</style>
