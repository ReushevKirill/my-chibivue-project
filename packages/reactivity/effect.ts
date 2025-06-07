import { Dep, createDep } from './dep'

type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
	constructor(public fn: () => T) {}

	run() {
		// ※ Сохраняем activeEffect перед выполнением fn и восстанавливаем его после выполнения.
		// Если не сделать этого, он будет переопределяться один за другим и вести себя непредсказуемо. (Давайте восстановим его до исходного состояния, когда закончите)
		let parent: ReactiveEffect | undefined = activeEffect
		activeEffect = this
		const res = this.fn()
		activeEffect = parent
		return res
	}
}

export function track(target: object, key: unknown) {
	let depsMap = targetMap.get(target)

	if (!depsMap) {
		targetMap.set(target, (depsMap = new Map()))
	}

	let dep = depsMap.get(key)
	if (!dep) {
		depsMap.set(key, (dep = createDep()))
	}

	if (activeEffect) {
		dep.add(activeEffect)
	}
}

export function trigger(target: object, key?: unknown) {
	const depsMap = targetMap.get(target)
	if (!depsMap) return

	const dep = depsMap.get(key)

	if (dep) {
		const effects = [...dep]
		for (const effect of effects) {
			effect.run()
		}
	}
}
