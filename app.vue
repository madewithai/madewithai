<script setup lang="ts">
const username = ref('');
const userData = ref<UserResponse | null>(null);
const isLoading = ref(false);
const fetchError = ref(false);
const sendError = ref(false);
const isSending = ref(false);
const isInputFocused = ref(false);
const alert = ref('');

const { data: members } = await useFetch('/api/listMembers');

const fetch = async () => {
  await $fetch<UserResponse>('/api/getByUsername', {
    method: 'POST',
    body: { username: username.value },
  })
    .then(res => {
      if (res.error) {
        userData.value = null;
        fetchError.value = true;
      } else {
        userData.value = res;
      }
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
  await $fetch<InviteResponse>('/api/createInvitation', {
    method: 'POST',
    body: { invitee_id: userData.value.id },
  })
    .then(res => {
      if (res.error) {
        sendError.value = true;
        alert.value = res.error;
      } else {
        alert.value = 'Invite sent! Check your email.';
      }
    })
    .finally(() => {
      isSending.value = false;
    });
};

const throttledFetch = useDebounceFn(fetch, 200);

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
      content: 'AI-powered tools and solutions for everyone. Join us for unrestricted access. ✨',
    },
    { property: 'og:image', content: 'https://madewithai.netlify.app/social-card.jpg' },
  ],
});
</script>

<template>
  <div class="container">
    <div :class="['card', { error: fetchError }]">
      <div class="form">
        <FormTitle />
        <div :class="['join', { 'input-focused': isInputFocused }]">
          <UserAvatar :username="username" :fetchError="fetchError" :isLoading="isLoading" :avatar="userData?.avatar" />
          <input v-model="username" type="text" placeholder="Type your Github username" @focus="isInputFocused = true" @blur="isInputFocused = false" @keyup.enter="sendInvite" />
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
.input-focused {
  &.join {
    border: 1px solid #81ff6c;
    box-shadow: 0px 9px 30px -15px rgb(150 243 135 / 50%);
    background: rgb(48 83 42 / 20%);
  }
  .none {
    background-color: #81ff6c;
  }
  .submit {
    border: 1px solid #81ff6c;
    color: #81ff6c;
  }
  input {
    &::placeholder {
      color: #ccc;
    }
  }
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
input {
  background: transparent;
  border: 0px;
  color: #95f386;
  font-size: x-small;
  flex: 1 1 0%;
  padding: 0px 8px;
  line-height: 40px;
  text-shadow: rgba(150, 243, 135, 0.4) 0px 0px 10px;
  &:focus {
    outline: none;
    color: #81ff6c;
  }
  &::placeholder {
    padding: 23px 0px;
    text-shadow: #000 0px 3px 5px;
    color: #999;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
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
    ::selection {
      background: #4f1a1a;
    }
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
    border: 1px solid;
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
