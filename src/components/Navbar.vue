<template>
  <div class="wrapper" id="nav-menu">
    <AppLogo />
    <div id="menu">
      <ul>
        <li><router-link to="/explore" class="fs-2" :class="$route.path === '/explore' ? 'active' : ''">&#128220;</router-link></li>
        <li><router-link to="/cash-drop" class="fs-2" :class="$route.path === '/cash-drop' ? 'active' : ''">&#128167;</router-link></li>
        <li><router-link to="/collect" class="fs-2" :class="$route.path === '/collect' ? 'active' : ''">&#128176;</router-link></li>
        <li><router-link to="/setting" class="fs-2" :class="[$route.path === '/setting' ? 'active' : '', $route.path === '/setting/recovery-seed' ? 'active' : '']">&#x2699;&#xFE0F;</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
import AppLogo from '../components/AppLogo.vue'

export default {
  data () {
    return {}
  },
  components: {
    AppLogo
  }
}
</script>

<style>
</style>
