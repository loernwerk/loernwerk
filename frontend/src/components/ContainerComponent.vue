<template>
  <div
    class="p-2 border-1 rounded-md bg-container border-container-border box-border shadow overflow-hidden flex flex-col max-h-0 min-h-full"
  >
    <div>
      <slot name="Header"></slot>
    </div>
    <div class="flex-grow overflow-y-auto">
      <div class="min-h-0 max-h-full">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
