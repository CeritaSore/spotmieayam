<script setup lang="ts">
import { computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        secondary: 'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        destructive: 'border-transparent bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
        outline: 'text-gray-950 dark:text-gray-50 border-gray-300 dark:border-gray-700',
        success: 'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

type BadgeVariants = VariantProps<typeof badgeVariants>

interface Props {
  variant?: BadgeVariants['variant']
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const computedClass = computed(() => {
  return cn(badgeVariants({ variant: props.variant }), props.class)
})
</script>

<template>
  <div :class="computedClass">
    <slot />
  </div>
</template>
