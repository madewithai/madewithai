<script setup lang="ts">
const config = useRuntimeConfig();
import { Octokit } from '@octokit/rest';
const octokit = new Octokit({ auth: config.public.ghToken });

const username = ref('');
const userData = ref<UserData | null>(null);
const isLoading = ref(false);
const fetchError = ref(false);
const sendError = ref(false);
const isSending = ref(false);
const alert = ref('');

const { data: members } = await octokit.orgs.listMembers({ org: config.public.org });

const fetch = async () => {
  await octokit.users
    .getByUsername({ username: username.value })
    .then(({ data }) => {
      userData.value = data;
    })
    .catch(() => {
      userData.value = null;
      fetchError.value = true;
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const sendInvite = async () => {
  if (!userData.value || !username.value) return;
  isSending.value = true;
  sendError.value = false;
  alert.value = '';
  await octokit.orgs
    .createInvitation({
      org: config.public.org,
      invitee_id: userData.value.id,
    })
    .then(({ data }) => {
      console.log(data);
      alert.value = 'Invite sent! Check your email.';
    })
    .catch(error => {
      console.log(error);
      sendError.value = true;
      alert.value = 'Invitation could not be sent.';
    })
    .finally(() => {
      isSending.value = false;
    });
};

const throttledFetch = useDebounceFn(fetch, 20);

watch(
  () => username.value,
  newUsername => {
    fetchError.value = false;
    if (newUsername) {
      isLoading.value = true;
      throttledFetch();
    }
  }
);

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  title: 'Made With AI',
  meta: [
    {
      name: 'description',
      content:
        'Welcome to Made With AI, a collaborative hub for showcasing and developing tools and solutions powered by artificial intelligence. This organization is dedicated to fostering innovation and sharing AI-driven projects with a global community. ✨',
    },
    { property: 'og:image', content: '/social-card.png' },
  ],
});
</script>

<template>
  <div class="container">
    <div :class="['card', { error: fetchError }]">
      <div class="form">
        <FormTitle />
        <div class="join">
          <div v-if="!username || fetchError" class="avatar none"></div>
          <div v-else-if="isLoading" class="avatar">
            <Icon name="svg-spinners:bars-rotate-fade" size="32" />
          </div>
          <img v-else-if="userData" :src="userData.avatar_url" class="avatar" />
          <input v-model="username" type="text" placeholder="Type your Github username" @keyup.enter="sendInvite" />
          <div class="submit" @click="sendInvite">
            <span class="submit-text">join us</span>
            <Icon name="pixelarticons:arrow-right" size="18" />
          </div>
        </div>
      </div>
      <div class="members">{{ members ? members.length : 941 }} PEOPLE JOINED</div>
      <Transition name="fade">
        <div v-if="isSending" class="alert-loading">
          <Icon name="svg-spinners:6-dots-rotate" size="18" />
        </div>
        <div v-else-if="alert" :class="['message', { error: sendError }]">
          <div style="padding: 5px 10px 3px 10px">{{ alert }}</div>
        </div>
      </Transition>
    </div>
  </div>
  <div class="background">
    <BackgroundSvg :fetchError="fetchError" />
  </div>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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
.message {
  max-width: 30rem;
  font-size: 9px;
  text-align: center;
  line-height: 20px;
  position: absolute;
  bottom: -5rem;
  border: 1px solid;
  border-radius: 99px;
  background-color: rgb(2 82 7 / 30%);
  display: flex;
  align-items: center;
  justify-content: center;
  &.error {
    border: 1px solid #e90c32;
    background-color: rgb(82 2 16 / 30%);
    color: #e90c32;
    text-shadow: 0px 0px 10px rgb(243 135 135 / 40%);
  }
}

.alert-loading {
  position: absolute;
  bottom: -5rem;
  padding: 5px;
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
