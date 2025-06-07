import { createApp, h, reactive } from 'chibivue'

const app = createApp({
  setup() {
    const state = reactive({ count: 0 })
    const increment = () => {
      state.count++
    }
		const decrement = () => {
			state.count--
		}

    return function render() {
      return h('div', { id: 'my-app' }, [
        h('p', {}, [`count: ${state.count}`]),
        h('button', { onClick: increment }, ['increment']),
        h('button', { onClick: decrement }, ['decrement']),
      ])
    }
  },
})

app.mount('#app')
