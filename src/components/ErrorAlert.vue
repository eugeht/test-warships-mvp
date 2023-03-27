<script setup lang="ts">
// Vue
import { defineProps } from 'vue'
// Composables
import { useErrorAlert } from '@/composables/useErrorAlert'



// Props
defineProps<{
  error : unknown
}>()



// Composables
const { closeAlert } = useErrorAlert()

</script>



<template>
  <div 
    class="error-alert"
  >
    <div class="error-alert-body">
      <div class="error-alert-body-header">
        <span v-if="error && typeof error === 'object' && 'name' in error">
          {{ error.name }}
        </span>
        <button 
          class="error-alert-body-close"
          @click="closeAlert"
        >
          <svg
            class="error-alert-body-close__icon"
            width="24"
            height="24"
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use xlink:href="#svg-icon-close-cross" />
          </svg>
        </button>
      </div>
      <div class="error-alert-body-content">
        <p v-if="error && typeof error === 'object' && 'message' in error">
          {{ error.message }}
        </p>
      </div>
    </div>
  </div>
</template>



<style lang="scss">
// ERROR ALERT -----------------------------------------------------------------
.error-alert {
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  z-index: 100000;
  background: #{ $color-intensedarkblue-a75 };
  backdrop-filter: blur(4px);

  display: flex;
}

.error-alert-body {
  margin: auto;
  background: var(--color-bg);
  box-shadow: 0 #{ rem( 2px ) } #{ rem( 4px ) } #{ $color-black-a30 };
  min-width: 280px;
  max-width: 90%;
}

.error-alert-body-close {
  position: absolute;
  top: 0;
  right: 0;

  padding: #{rem(8px)};

  z-index: 10000;

  transition: all 0.1s linear;

  border: none;

  color: var(--color-text);
  background: none;
  opacity: 0.75;
  cursor: pointer;
  appearance: none;
  
  &:hover {
    opacity: 1;
    background-color: var(--color-input-bg);
  }

  &::before {
    content: '';

    inset: #{rem(-16px)} #{rem(-16px)} #{rem(-16px)} #{rem(-16px)};
  }
}

.error-alert-body-close__icon {
  display: block;
}

.error-alert-body-header {
  position: relative;
  padding: #{rem(10px)};
  background: #{ $color-red };
}

.error-alert-body-content {
  padding: #{rem(10px)};
}
// /ERROR ALERT

</style>
