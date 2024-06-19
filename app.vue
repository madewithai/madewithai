<script setup lang="ts">
const config = useRuntimeConfig();
import { Octokit } from '@octokit/rest';
const octokit = new Octokit({ auth: config.public.ghToken });

const username = ref('');
const userData = ref<UserData | null>(null);
const isLoading = ref(false);
const error = ref(false);

const { data: members } = await octokit.orgs.listMembers({ org: config.public.org });

const fetch = async () => {
  octokit.users
    .getByUsername({ username: username.value })
    .then(({ data }) => {
      userData.value = data;
    })
    .catch(() => {
      userData.value = null;
      error.value = true;
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const sendInvite = async () => {
  if (!userData.value || !username.value) return;
  await octokit.orgs.createInvitation({
    org: config.public.org,
    invitee_id: userData.value.id,
  });
};

const throttledFetch = useDebounceFn(fetch, 100);

watch(
  () => username.value,
  newUsername => {
    error.value = false;
    if (newUsername) {
      isLoading.value = true;
      throttledFetch();
    }
  }
);
</script>

<template>
  <div class="container">
    <div :class="['card', { error: error }]">
      <div class="form">
        <div class="content">
          <span class="title">
            <span>>_</span>
            <span>MADE WITH AI</span>
          </span>
          <span class="desc">Join the community of developers who are building the future of the AI.</span>
        </div>
        <div class="join">
          <div v-if="!username || error" class="avatar none"></div>
          <div v-else-if="isLoading" class="avatar">
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
          <img v-else-if="userData" :src="userData.avatar_url" class="avatar" />
          <input v-model="username" type="text" placeholder="Type your Github username" />
          <div class="submit" @click="sendInvite">
            <span class="submit-text">join us</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path fill="currentColor" d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2zm10-4h2v2h-2zm0 0h-2V5h2zm0 10h2v-2h-2zm0 0h-2v2h2z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="members">{{ members ? members.length : 941 }} PEOPLE JOINED</div>
    </div>
  </div>
  <div class="background">
    <svg width="1466" height="1466" viewBox="-1 -1 1466 1466" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 1149.26L1464 1149.26M0 1089.65L1464 1089.65M0 1030.05L1464 1030.05M0 970.437L1464 970.437M0 910.828L1464 910.827M0 851.218L1464 851.218M0 791.609L1464 791.609M0 732L1464 732M0 672.391L1464 672.391M0 612.782L1464 612.782M0 553.173L1464 553.173M0 493.564L1464 493.564M0 433.955L1464 433.954M0 374.345L1464 374.345M0 314.736L1464 314.736M1149.26 1464L1149.26 0M1089.65 1464L1089.65 2.6056e-06M1030.05 1464L1030.05 5.21119e-06M970.437 1464L970.436 7.81679e-06M910.828 1464L910.827 1.04224e-05M851.218 1464L851.218 1.3028e-05M791.609 1464L791.609 1.56336e-05M732 1464L732 1.82392e-05M672.391 1464L672.391 2.08448e-05M612.782 1464L612.782 2.34504e-05M553.173 1464L553.173 2.6056e-05M493.564 1464L493.563 2.86616e-05M433.955 1464L433.954 3.12672e-05M374.345 1464L374.345 3.38728e-05M314.736 1464L314.736 3.64784e-05"
        stroke="url(#svg102455267_1249_paint0_radial_390_328)"></path>
      <defs>
        <radialGradient
          id="svg102455267_1249_paint0_radial_390_328"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(732 732) rotate(90) scale(446)">
          <stop :stop-color="error ? '#320000' : '#042000'"></stop>
          <stop offset="1" :stop-color="error ? '#0f0000' : '#020f00'" stop-opacity="0"></stop>
        </radialGradient>
      </defs>
    </svg>
  </div>
</template>

<style lang="scss">
* {
  font-family: 'Press Start 2P', cursive;
}
html,
body {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #010101;
  flex-direction: column;
  color: #95f386;
  margin: 0;
  overflow: hidden;
}
*::selection {
  background: #1a4f1a;
  box-sizing: border-box;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-shadow: 0px 0px 10px rgb(150 243 135 / 40%);
  z-index: 99;
  position: relative;
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
  border: 1px solid #95f386;
  padding: 8px;
  border-radius: 99px;
  box-shadow: 0px 9px 30px -15px rgb(150 243 135 / 40%);
  background: rgb(48 83 42 / 15%);
  backdrop-filter: blur(3px);
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
.avatar {
  align-items: center;
  display: flex;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: 99px;
  box-shadow: 0px 3px 5px #000;
}
.none {
  background-color: #95f386;
  color: #000;
  font-size: 8px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
input {
  background: transparent;
  border: 0px;
  color: #95f386;
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
    text-shadow: #000 0px 3px 5px;
    color: #999;
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
  box-shadow: 0px 3px 5px #000;
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
.background {
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.error {
  .submit {
    background-color: #140c0c;
    color: #e90c32;
    text-shadow: rgb(243 135 135 / 40%) 0px 0px 10px;
    &:hover {
      background-color: #351b1b;
    }
  }
  .join {
    border: 1px solid #e90c31;
    box-shadow: 0px 9px 30px -15px rgb(243 135 135 / 40%);
    background: rgb(83 42 42 / 15%);
    animation: shake 0.2s ease-in-out 0s 2;
  }
  .none {
    background-color: #e90c31;
  }
  input {
    color: #e90c31;
    text-shadow: rgb(243 135 135 / 40%) 0px 0px 10px;
    &::selection {
      background: #4f1a1a;
    }
  }
}

@keyframes shake {
  0% {
    margin-left: 0rem;
    margin-right: 0rem;
  }
  25% {
    margin-left: 0.5rem;
    margin-right: -0.5rem;
  }
  75% {
    margin-left: -0.5rem;
    margin-right: 0.5rem;
  }
  100% {
    margin-left: 0rem;
    margin-right: 0rem;
  }
}
</style>
