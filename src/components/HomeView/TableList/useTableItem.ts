import { computed, nextTick, ref, watch } from 'vue'
import type { EmitFn, ShallowRef } from 'vue'
import { useElementBounding, useFocus } from '@vueuse/core'
import { useRouter } from 'vue-router'

import { formatTimestampToStringDate } from '@/shared/utils'

import { useTablesStore } from '@/stores/tables'
import { useBreakpoints } from '@/composables/useBreakpoints'
import { useMenuToggle } from '@/composables/useMenuToggle'

import type { Emits, Props } from './types'

export function useTableItem(
  props: Props,
  emit: EmitFn<Emits>,
  tableItemRef: Readonly<ShallowRef<HTMLDivElement | null>>,
  input: ShallowRef,
) {
  const router = useRouter()
  const tablesStore = useTablesStore()

  const { width, top, update } = useElementBounding(tableItemRef)
  const { focused } = useFocus(input, { initialValue: true })

  const breakpoints = useBreakpoints()
  const { isMenuOpen, toggleMenu } = useMenuToggle()

  const isEditMode = ref(false)

  const stringDate = computed(() => formatTimestampToStringDate(props.date))

  async function goToTable() {
    await router.push({ name: 'Table', params: { tableId: props.tableId } })
  }

  async function setEditMode() {
    isEditMode.value = true
    toggleMenu()

    await nextTick()
    focused.value = true
  }

  function renameTable(value: string) {
    emit('rename', value)
    isEditMode.value = false
  }

  function removeTable() {
    emit('delete')
    isEditMode.value = false
    toggleMenu()
  }

  watch(top, () => isMenuOpen.value = false)

  watch(() => tablesStore.filteredTables, async () => {
    await nextTick()
    update()
  })

  return {
    width,
    breakpoints,
    isMenuOpen,
    toggleMenu,
    isEditMode,
    stringDate,
    setEditMode,
    renameTable,
    removeTable,
    goToTable,
  }
}
