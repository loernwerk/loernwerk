<!-- Main component for seperating semantic contents -->
<template>
  <div
    class="p-2 border-1 rounded-md bg-container border-container box-border shadow overflow-hidden flex flex-col"
  >
    <div>
      <!-- Header that does not get scrolled -->
      <slot name="Header"></slot>
    </div>
    <div class="flex-grow overflow-y-auto max-h-full min-h-0 flex flex-col">
      <div class="min-h-0 max-h-full">
        <!-- Scrollable body -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>
