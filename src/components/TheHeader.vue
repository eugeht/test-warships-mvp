<script setup lang="ts">
// Vue
import { ref, type Ref } from 'vue'
// Components
import  LocaleForm from '@/components/LocaleForm.vue'



// LANGUAGE MENU ---------------------------------------------------------------
const isLanguageMenuVisible: Ref<boolean> = ref( false )


const showLanguageMenu = () => {
  isLanguageMenuVisible.value = true
}


const hideLanguageMenu = () => {
  isLanguageMenuVisible.value = false
}
// /LANGUAGE MENU

</script>



<template>
  <header class="the-header">
    <div class="the-header__container the-header-nav">
      <div class="the-header-logo">
        <svg
          class="the-header-logo__img the-header-logo__img--small"
          width="35"
          height="42"
          viewBox="0 0 35 42" 
        >
          <use xlink:href="#svg-icon-logo-small" />
        </svg>
        <svg
          class="the-header-logo__img the-header-logo__img--default"
          width="238"
          height="28"
          viewBox="0 0 238 28"
        >
          <use xlink:href="#svg-icon-logo" />
        </svg>
      </div>

      <div 
        class="the-header-lang"
        :class="{
          'the-header-lang--active': isLanguageMenuVisible
        }"
      >
        <button 
          class="the-header-lang-btn"
          aria-label="Change language (сюда надо перевод)"
          @click="isLanguageMenuVisible ? hideLanguageMenu() : showLanguageMenu()"
        >
          <svg
            class="the-header-lang-btn__img"
            width="64"
            height="32"
            viewBox="0 0 783 400"
          >
            <use xlink:href="#svg-icon-world" />
          </svg>
          <svg
            class="the-header-lang-btn__arrow"
            width="16"
            height="16"
            viewBox="0 -20 200 220"
          >
            <use xlink:href="#svg-icon-chevron-up" />
          </svg>
        </button>
        <div
          v-if="isLanguageMenuVisible"
          class="the-header-lang__menu"
        >
          <LocaleForm 
            @close="hideLanguageMenu()"
          />
        </div>
      </div>
    </div>
  </header>
</template>



<style lang="scss">
$header-logo-breakpoint: #{ rem(420px) };



// MAIN LAYOUT -----------------------------------------------------------------
.the-header {
  background-color: var(--color-header);
}


.the-header__container {
  position: relative;

  margin: 0 #{ rem(16px) };
}


.the-header-nav {
  padding: #{ rem(16px) } 0;

  display: flex;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

// /MAIN LAYOUT



// LOGO ------------------------------------------------------------------------
.the-header-logo {
  height: rem(32px);
}


.the-header-logo__img {
  height: 100%;
  width: auto;

  &.the-header-logo__img--small {
    display: block;

    @media only screen and (min-width: #{ $header-logo-breakpoint }) {
      display: none;
    }
  }

  &.the-header-logo__img--default {
    display: none;

    @media only screen and (min-width: #{ $header-logo-breakpoint }) {
      display: block;
    }
  }
}

// /LOGO



// LANGUAGE SELECTOR -----------------------------------------------------------
.the-header-lang {
  position: relative;
}


.the-header-lang-btn {
  display: flex;
  padding: #{ rem(16px) };
  margin: #{ rem(-16px) };

  flex-direction: row;
  align-items: center;

  transition: color 0.1s linear, background 0.1s linear;

  border: none;

  color: var(--color-text-a50);
  cursor: pointer;
  appearance: none;
  background: none;

  .the-header-lang.the-header-lang--active &,
  &:hover {
    color: var(--color-text);

    background: var(--color-header-hover);
  }
}


.the-header-lang-btn__arrow {
  margin-left: rem(8px);

  transition: transform 0.2s linear;

  .the-header-lang.the-header-lang--active & {
    transform: rotate(180deg);
  }
}


.the-header-lang__menu {
  position: absolute;
  top: 100%;
  right: 0;

  margin-top: #{ rem(16px) };
  margin-right: #{ rem(-16px) };

  z-index: 1000;
  background: var(--color-header-hover);
}

// /LANGUAGE SELECTOR

</style>
