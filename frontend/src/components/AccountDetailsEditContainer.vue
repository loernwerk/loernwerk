<template>
  <ContainerComponent>
    <table>
      <tr>
        <td>Nutzername:</td>
        <td>
          <TextInputComponent />
        </td>
      </tr>
      <tr>
        <td>E-mail:</td>
        <td>
          <TextInputComponent />
        </td>
      </tr>
      <tr>
        <td>Passwort:</td>
        <td>
          <TextInputComponent />
        </td>
      </tr>
      <tr>
        <td>Passwort wiederholen:</td>
        <td>
          <TextInputComponent />
        </td>
      </tr>
    </table>
    <ButtonComponent>Speichern</ButtonComponent>
  </ContainerComponent>
</template>
<script setup lang="ts">
import TextInputComponent from './TextInputComponent.vue';
import ButtonComponent from './ButtonComponent.vue';
import ContainerComponent from './ContainerComponent.vue';
</script>
