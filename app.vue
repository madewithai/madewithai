<script setup lang="ts">
const username = ref('');
const { data: avatar, pending } = await useFetch(() => `https://api.github.com/users/${username.value}`);
const { data: members } = await useFetch('https://api.github.com/orgs/madewithai/members');
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="form">
        <div class="content">
          <span class="title">
            <span>>_</span>
            <span>MADE WITH AI</span>
          </span>
          <span class="desc">Join the community of developers who are building the future of the AI.</span>
        </div>
        <div class="join">
          <img v-if="avatar" :src="avatar.avatar_url" class="avatar" />
          <div v-else-if="pending" class="avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <g>
                <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity=".14" />
                <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity=".29" transform="rotate(30 12 12)" />
                <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity=".43" transform="rotate(60 12 12)" />
                <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity=".57" transform="rotate(90 12 12)" />
                <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity=".71" transform="rotate(120 12 12)" />
                <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity=".86" transform="rotate(150 12 12)" />
                <rect width="2" height="5" x="11" y="1" fill="currentColor" transform="rotate(180 12 12)" />
                <animateTransform
                  attributeName="transform"
                  calcMode="discrete"
                  dur="0.75s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" />
              </g>
            </svg>
          </div>
          <div v-else-if="!username" class="avatar none"></div>
          <input v-model="username" type="text" placeholder="Type your Github username" />
          <div class="submit">
            <span class="submit-text">join us</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path fill="currentColor" d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2zm10-4h2v2h-2zm0 0h-2V5h2zm0 10h2v-2h-2zm0 0h-2v2h2z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="members">{{ members.length }} PUBLIC MEMBER</div>
    </div>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Press+Start+2P');

* {
  font-family: 'Press Start 2P', cursive;
}

$color: #95f386;
$color2: #1a4f1a;
$glowSize: 10px;

html,
body {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #010101;
  flex-direction: column;
  color: $color;
  margin: 0;
}
*::selection {
  background: $color2;
  box-sizing: border-box;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-shadow: 0px 0px 10px rgb(150 243 135 / 40%);
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
.form {
  display: flex;
  flex-direction: column;
  max-width: 33rem;
  gap: 2rem;
}
.content {
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 0 1rem;
}

.title {
  margin-bottom: 1rem;
  gap: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.desc {
  font-size: 0.7rem;
  line-height: 19px;
}

.join {
  display: flex;
  font-size: x-small;
  border: 1px solid $color;
  padding: 8px;
  border-radius: 99px;
}
.avatar {
  align-items: center;
  display: flex;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: 99px;
}
.none {
  background-color: $color;
  color: #000;
  font-size: 8px;
}
input {
  background: transparent;
  border: 0px;
  color: $color;
  padding: 0;
  font-size: x-small;
  flex: 1 1 0%;
  padding: 0px 8px;
  line-height: 23px;
  text-shadow: rgba(150, 243, 135, 0.4) 0px 0px 10px;
  &:focus {
    outline: none;
  }
  &::placeholder {
    padding: 23px 0px;
    text-shadow: 0px 0px 0px;
  }
}
.submit {
  border-radius: 99px;
  padding: 10px 12px 10px 16px;
  border: 1px solid;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #0d140c;
  cursor: pointer;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
  user-select: none;
  &:hover {
    background-color: #1e351b;
  }
  &:active {
    transform: scale(0.95);
  }
}

.submit-text {
  line-height: 14px;
  display: flex;
  height: 12px;
}

.members {
  font-size: 10px;
  line-height: 18px;
}
</style>
