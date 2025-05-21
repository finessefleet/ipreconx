<template>
<h1>IPRECONX</h1>
<div class="container">
    <div class="ipaddress" v-for="ipaddress in blacklistedIps">
        {{ ipaddress }}
    </div>
</div>
</template>

<script setup>
import { ref } from "vue"

const blacklistedIps = ref([])

const url = "https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level1.netset"

async function getBlackListedIps() {

    const response = await fetch(url);
    const rawContent = await response.text()

    const regex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

    blacklistedIps.value = rawContent.match(regex)

}

getBlackListedIps();

</script>

<style>
.container {
    background-color: #fff;
    display: grid;
    /* grid-template-columns: 150px; */
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
}
.ipaddress {
    background-color: #f1f1f1;
    padding: 7px 15px;
    border-radius: 5px;
    font-family: 'Courier New', Courier, monospace;
    color:#333
}
</style>