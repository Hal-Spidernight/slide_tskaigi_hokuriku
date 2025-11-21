<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>
<script setup lang="ts">
import { hc } from 'hono/client'
import type { AppType } from '../../backend/src/index'

const client = hc<AppType>('http://localhost:3001/')

client.api.users
  .$post({
    json: {
      name: 'Taro Yamada',
      email: 'sssssss@gmail.com',
      age: 25,
    },
  })
  .then((res) => {
    console.log(res)
  })
</script>
