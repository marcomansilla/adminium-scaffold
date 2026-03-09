<!-- AutoLoginProxy.vue -->
<template lang="pug">
q-page
  .login-container
    q-card.q-pa-md
      q-card-section.text-center
        q-icon(
          :name="showDashboard ? 'dashboard' : 'shield'"
          :color="showDashboard ? 'positive' : 'primary'"
          size="64px"
        )

        h4.text-h4.q-mt-md {{ pageTitle }}
        p.text-subtitle1(:class="showDashboard ? 'text-positive' : 'text-grey-7'")
          | {{ pageSubtitle }}

      q-card-section(v-if="!showDashboard")
        .row.justify-center.q-gutter-md
          q-btn(
            color="primary"
            label="Cargar Login"
            @click="loadLoginPage"
            :loading="loading"
            icon="cloud_download"
            size="large"
          )
          q-btn(
            color="secondary"
            label="Auto Login"
            @click="triggerAutoLogin"
            :disable="!iframeLoaded"
            icon="login"
            size="large"
          )
          q-btn(
            color="info"
            label="Abrir en nueva pestaña"
            @click="openInNewTab"
            icon="open_in_new"
            flat
          )

      q-card-section(v-if="error")
        q-banner(
          class="bg-negative text-white"
          rounded
        )
          template(v-slot:avatar)
            q-icon(name="error")
          | {{ error }}
          template(v-slot:action)
            q-btn(
              flat
              color="white"
              label="Reintentar"
              @click="loadLoginPage"
            )

      q-card-section.iframe-container
        q-inner-loading(:showing="iframeLoading")
          q-spinner(color="primary" size="50px")
          .q-mt-sm Cargando página...

        iframe(
          v-if="iframeUrl && !showDashboard"
          ref="iframeRef"
          :src="iframeUrl"
          @load="onIframeLoad"
          frameborder="0"
          width="100%"
          height="650"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-modals allow-downloads allow-storage-access-by-user-activation allow-top-navigation"
        )

        iframe(
          v-if="showDashboard"
          ref="dashboardIframe"
          :src="dashboardUrl"
          @load="onDashboardLoad"
          frameborder="0"
          width="100%"
          height="650"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-modals allow-downloads allow-storage-access-by-user-activation allow-top-navigation"
        )

        .no-iframe(v-if="!iframeUrl && !showDashboard")
          q-icon(name="browser_not_supported" size="48px" color="grey-5")
          p.text-grey-7 Carga la página de login para comenzar

      q-card-section.q-mt-md(v-if="iframeLoaded && !showDashboard")
        q-separator.q-mb-md
        .row.justify-center.q-gutter-sm
          q-chip(
            icon="check_circle"
            color="positive"
            text-color="white"
            outline
          ) Iframe cargado

          q-chip(
            icon="person"
            color="info"
            text-color="white"
            outline
          ) Usuario: 27251965418

          q-chip(
            icon="lock"
            color="info"
            text-color="white"
            outline
            @click="copyPassword"
            clickable
          ) Copiar contraseña
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'

// Configuración
const PROXY_URL = 'http://localhost:3100/api/proxy/login-page'
const AUTO_LOGIN_URL = 'http://localhost:3100/api/proxy/auto-login'

// Credenciales
const CREDENTIALS = {
  username: '27251965418',
  password: 'Avelino50*'
}

// Estado
const iframeRef = ref(null)
const dashboardIframe = ref(null)
const iframeUrl = ref(null)
const dashboardUrl = ref(null)
const iframeLoading = ref(false)
const iframeLoaded = ref(false)
const loading = ref(false)
const error = ref(null)
const showDashboard = ref(false)

// Quasar
const $q = useQuasar()

// Computed
const pageTitle = computed(() => {
  return showDashboard.value ? 'Dashboard' : 'Acceso al Sistema'
})

const pageSubtitle = computed(() => {
  return showDashboard.value ? 'Sistema de intermediarios' : 'Login automático'
})

// Manejador de mensajes del iframe
const handleIframeMessages = (event) => {
  console.log('📨 Mensaje recibido:', event.data)

  if (event.data && event.data.type === 'PROXY_READY') {
    console.log('✅ Proxy listo')
  }

  if (event.data && event.data.type === 'LOGIN_SUCCESS') {
    console.log('🎉 Login exitoso!')

    $q.notify({
      type: 'positive',
      message: '✅ Login exitoso',
      caption: 'Cargando dashboard...',
      position: 'top',
      timeout: 2000
    })

    // Cargar dashboard
    loadDashboard()
  }

  if (event.data && event.data.type === 'LOGIN_ERROR') {
    $q.notify({
      type: 'negative',
      message: '❌ Error en login',
      caption: event.data.message,
      position: 'top'
    })
  }
}

// Escuchar mensajes
onMounted(() => {
  window.addEventListener('message', handleIframeMessages)
})

onUnmounted(() => {
  window.removeEventListener('message', handleIframeMessages)
})

// Cargar página de login
const loadLoginPage = () => {
  iframeLoading.value = true
  loading.value = true
  error.value = null
  showDashboard.value = false

  iframeUrl.value = PROXY_URL
  loading.value = false
}

// Cuando el iframe de login carga
const onIframeLoad = () => {
  iframeLoading.value = false
  iframeLoaded.value = true

  $q.notify({
    type: 'positive',
    message: 'Página cargada',
    position: 'top',
    timeout: 1500
  })
}

// Auto login
const triggerAutoLogin = () => {
  if (!iframeRef.value || !iframeLoaded.value) {
    $q.notify({
      type: 'warning',
      message: 'Espera a que la página cargue',
      position: 'top'
    })
    return
  }

  $q.dialog({
    title: 'Auto Login',
    message: '¿Enviar credenciales al formulario?',
    persistent: true,
    ok: { label: 'Sí, enviar', color: 'primary' },
    cancel: 'Cancelar'
  }).onOk(() => {
    $q.notify({
      type: 'info',
      message: 'Enviando credenciales...',
      position: 'top',
      timeout: 2000
    })

    try {
      iframeRef.value.contentWindow.postMessage({
        type: 'AUTO_LOGIN',
        username: CREDENTIALS.username,
        password: CREDENTIALS.password
      }, '*')

    } catch (err) {
      console.error('Error:', err)
      $q.notify({
        type: 'negative',
        message: 'Error al enviar credenciales',
        position: 'top'
      })
    }
  })
}

// Cargar dashboard
const loadDashboard = async () => {
  const notify = $q.notify({
    type: 'info',
    message: 'Cargando dashboard...',
    position: 'top',
    timeout: 0,
    actions: [
      { label: 'OK', color: 'white', handler: () => { notify() } }
    ]
  })

  try {
    console.log('🔄 Llamando a /auto-login...')
    const response = await axios.post(AUTO_LOGIN_URL, CREDENTIALS)

    console.log('📦 Respuesta completa:', response.data)

    if (response.data.success) {
      if (response.data.dashboard_content) {
        notify()

        // Crear blob con el contenido del dashboard
        const blob = new Blob([response.data.dashboard_content], { type: 'text/html' })
        dashboardUrl.value = URL.createObjectURL(blob)

        showDashboard.value = true
        iframeLoaded.value = false

        $q.notify({
          type: 'positive',
          message: '✅ Dashboard cargado',
          position: 'top',
          timeout: 2000
        })
      } else {
        notify()
        console.error('❌ Respuesta success pero sin dashboard_content')
        $q.notify({
          type: 'warning',
          message: 'Login exitoso pero no se pudo obtener el dashboard',
          caption: 'Intenta abrir en nueva pestaña',
          position: 'top',
          timeout: 4000
        })
      }
    } else {
      notify()
      const errorMsg = response.data.error || 'Error desconocido'
      console.error('❌ Login falló:', errorMsg)

      $q.notify({
        type: 'negative',
        message: '❌ Login falló',
        caption: errorMsg,
        position: 'top',
        timeout: 4000
      })

      // Mostrar diálogo con credenciales para intentar manualmente
      $q.dialog({
        title: 'Login manual',
        message: `Usuario: ${CREDENTIALS.username}<br>Contraseña: ${CREDENTIALS.password}`,
        html: true,
        ok: { label: 'Abrir en nueva pestaña', color: 'primary' },
        cancel: 'Cerrar'
      }).onOk(() => {
        window.open('https://pi.elnorte.com.ar/intermediarios/com.intermediarios.login', '_blank')
      })
    }

  } catch (error) {
    notify()

    console.error('❌ Error en loadDashboard:', error)
    $q.notify({
      type: 'negative',
      message: 'Error cargando dashboard',
      caption: error.message,
      position: 'top',
      timeout: 3000
    })
  }
}

// Cuando el dashboard carga
const onDashboardLoad = () => {
  console.log('📊 Dashboard cargado')
  $q.notify({
    type: 'positive',
    message: 'Dashboard listo',
    position: 'top',
    timeout: 1500
  })
}

// Abrir en nueva pestaña
const openInNewTab = () => {
  window.open('https://pi.elnorte.com.ar/intermediarios/com.intermediarios.login', '_blank')

  $q.dialog({
    title: 'Credenciales',
    message: `Usuario: ${CREDENTIALS.username}<br>Contraseña: ${CREDENTIALS.password}`,
    html: true,
    ok: { label: 'Copiar', color: 'primary', handler: copyPassword },
    cancel: 'Cerrar'
  })
}

// Copiar contraseña
const copyPassword = () => {
  navigator.clipboard.writeText(CREDENTIALS.password)
  $q.notify({
    type: 'positive',
    message: 'Contraseña copiada',
    position: 'top',
    timeout: 1500
  })
}

// Reset
const resetLogin = () => {
  showDashboard.value = false
  iframeLoaded.value = false
  iframeUrl.value = null
  dashboardUrl.value = null
}

// Exponer métodos
defineExpose({
  loadLoginPage,
  triggerAutoLogin,
  resetLogin
})
</script>

<style scoped lang="stylus">
.login-container
  max-width: 1200px
  margin: 0 auto
  padding: 20px

  @media (max-width: 768px)
    padding: 10px

.iframe-container
  position: relative
  min-height: 650px
  border: 1px solid rgba(0,0,0,0.12)
  border-radius: 8px
  overflow: hidden
  margin-top: 20px
  background: white
  box-shadow: 0 2px 8px rgba(0,0,0,0.05)

  iframe
    display: block
    width: 100%
    height: 100%
    min-height: 650px
    background: white

.no-iframe
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  min-height: 400px
  color: rgba(0,0,0,0.5)
  gap: 16px
  background: #fafafa

:deep(.q-card)
  border-radius: 12px
  box-shadow: 0 4px 12px rgba(0,0,0,0.08)

@media (max-width: 768px)
  .iframe-container
    min-height: 500px

    iframe
      min-height: 500px
</style>