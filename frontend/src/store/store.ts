import { reactive } from 'vue'

export const store = reactive({
    selectedSequence: {},
    sequences: [],
    sharedSequences: [],
    // searchText: ''
})