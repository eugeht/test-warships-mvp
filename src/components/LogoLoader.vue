<template>
  <div 
    class="logo-loader"
  >
    <svg
      class="logo-loader__progress"
      width="80"
      height="80"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <use xlink:href="#svg-icon-loader" />
    </svg>
    <svg
      class="logo-loader__icon"
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <use xlink:href="#svg-icon-anchor" />
    </svg>
  </div>
</template>



<style lang="scss">
// Loader
.logo-loader {
  position: relative;
  margin: auto;
  width: 80px;
  height: 80px;
}

.logo-loader__progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  animation: 2s linear loader-rotate infinite;
}

.logo-loader__icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@keyframes loader-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
