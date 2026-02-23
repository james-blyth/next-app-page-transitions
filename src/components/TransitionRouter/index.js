'use client'

import { jsx } from 'react/jsx-runtime'
import { useState, useRef, useCallback, useEffect, useMemo, use, createContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { format } from 'url'
import NextLink from 'next/link'

function delegate(selector, type, callback, options = {}) {
	const { signal, base = document } = options
	if (signal?.aborted) return

	const { once, ...nativeListenerOptions } = options
	const baseElement = base instanceof Document ? base.documentElement : base

	const listenerFunction = (event) => {
		let target = event.target
		// Handle Text nodes
		if (target instanceof Text) {
			target = target.parentElement
		}

		// Find matching element using closest()
		if (target instanceof Element && event.currentTarget instanceof Node) {
			const delegateTarget = target.closest(selector)
			if (delegateTarget && event.currentTarget.contains(delegateTarget)) {
				// Add delegateTarget to event object
				Object.assign(event, { delegateTarget })
				callback.call(baseElement, event)

				if (once) {
					baseElement.removeEventListener(type, listenerFunction, nativeListenerOptions)
				}
			}
		}
	}

	baseElement.addEventListener(type, listenerFunction, nativeListenerOptions)

	signal?.addEventListener('abort', () => {
		baseElement.removeEventListener(type, listenerFunction, nativeListenerOptions)
	})
}

function isModifiedEvent(event) {
	const eventTarget = 'delegateTarget' in event ? event.delegateTarget : event.currentTarget
	const target = eventTarget && eventTarget.getAttribute ? eventTarget.getAttribute('target') : null
	return (
		(target && target !== '_self') ||
		event.metaKey ||
		event.ctrlKey ||
		event.shiftKey ||
		event.altKey || // triggers resource download
		('which' in event ? event.which : event.nativeEvent.which) === 2
	) // middle mouse button
}

function shouldLinkTriggerTransition(link, event) {
	return (
		link.target !== '_blank' && // not for new tab
		link.origin === window.location.origin && // ensure same origin
		link.rel !== 'external' && // ensure not marked as external
		!link.download && // not download link
		!isModifiedEvent(event) && // not a modifier key
		!event.defaultPrevented
	) // click was not cancelled
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
	try {
		var info = gen[key](arg)
		var value = info.value
	} catch (error) {
		reject(error)
		return
	}
	if (info.done) {
		resolve(value)
	} else {
		Promise.resolve(value).then(_next, _throw)
	}
}

function _async_to_generator(fn) {
	return function () {
		var self = this,
			args = arguments
		return new Promise(function (resolve, reject) {
			var gen = fn.apply(self, args)
			function _next(value) {
				asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value)
			}
			function _throw(err) {
				asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err)
			}
			_next(undefined)
		})
	}
}

const TransitionRouterContext = createContext({
	stage: 'none',
	navigate: () => {},
	isReady: false,
})

function TransitionRouter({
	children,
	leave = _async_to_generator(function* (next) {
		return next()
	}),
	enter = _async_to_generator(function* (next) {
		return next()
	}),
	auto = false,
	mode = null,
}) {
	const router = useRouter()
	const pathname = usePathname()
	const [stage, setStage] = useState('none')
	const leaveRef = useRef(null)
	const enterRef = useRef(null)
	const isPopStateRef = useRef(false)
	const previousPathnameRef = useRef(pathname)
	const transitionTimeoutRef = useRef(null)

	// Built-in in-out mode: clone old page and prepare for navigation
	const builtInLeave = useCallback(
		_async_to_generator(function* (next) {
			if (mode === 'in-out') {
				// Clean up any existing old pages, overlays, and kill animations first
				const existingOldPages = document.querySelectorAll('[data-old-page]')
				existingOldPages.forEach((page) => page.remove())

				// Clean up any orphaned overlays
				const existingOverlays = document.querySelectorAll('.page-transition-overlay')
				existingOverlays.forEach((overlay) => overlay.remove())

				const content = document.querySelector('[data-page-content]')
				if (content) {
					// Capture current scroll position
					const scrollY = window.scrollY

					// Create a viewport wrapper to crop to 100vh
					const viewportWrapper = document.createElement('div')
					viewportWrapper.setAttribute('data-old-page', 'true')
					viewportWrapper.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          pointer-events: none;
        `

					// Clone the old page to keep it visible
					const oldPageClone = content.cloneNode(true)
					oldPageClone.removeAttribute('data-page-content')
					oldPageClone.style.cssText = `
          position: absolute;
          top: ${-scrollY}px;
          left: 0;
          width: 100%;
          pointer-events: none;
        `

					viewportWrapper.appendChild(oldPageClone)
					document.body.appendChild(viewportWrapper)

					// Wait for clone to be appended (use promise to ensure DOM update)
					yield new Promise((resolve) => requestAnimationFrame(() => resolve()))

					// Hide original content temporarily
					content.style.opacity = '0'
				}
			}

			// Call navigation to load new page
			next()

			// Call custom leave callback AFTER navigation for in-out mode
			if (mode === 'in-out' && leave) {
				// Leave callback will animate the old page (which is now cloned)
				yield leave(() => {})
			} else if (leave) {
				// For out-in or no mode, call leave normally
				yield leave(next)
			}
		}),
		[mode, leave]
	)

	// Built-in in-out mode: setup new page and clean up clone
	const builtInEnter = useCallback(
		_async_to_generator(function* (next) {
			if (mode === 'in-out') {
				const content = document.querySelector('[data-page-content]')
				const oldPage = document.querySelector('[data-old-page]')

				if (content) {
					// Reset opacity first (may have been set to 0 during leave)
					content.style.opacity = '1'

					// Position new page and make it visible
					content.style.position = 'fixed'
					content.style.top = '0'
					content.style.left = '0'
					content.style.width = '100vw'
					content.style.height = '100vh'
					content.style.zIndex = '10000' // Above the old page and overlay
					content.style.visibility = 'visible'
				}

				// Call custom enter callback if provided
				if (enter) {
					yield enter(() => {
						// Clean up after enter animation - remove old page
						if (oldPage) oldPage.remove()

						// Reset styles on new page
						if (content) {
							content.style.position = ''
							content.style.top = ''
							content.style.left = ''
							content.style.width = ''
							content.style.height = ''
							content.style.zIndex = ''
							content.style.opacity = ''
							content.style.visibility = 'visible' // Keep visible after transition
						}
						next()
					})
				} else {
					// No custom enter, just cleanup old page
					if (oldPage) oldPage.remove()
					if (content) {
						content.style.position = ''
						content.style.top = ''
						content.style.left = ''
						content.style.width = ''
						content.style.height = ''
						content.style.zIndex = ''
						content.style.opacity = ''
					}
					next()
				}
			} else {
				// out-in or no mode - just call custom enter
				if (enter) {
					yield enter(next)
				} else {
					next()
				}
			}
		}),
		[mode, enter]
	)

	const navigate = useCallback(
		_async_to_generator(function* (href, pathname, method = 'push', options) {
			if (stage === 'leaving') return Promise.resolve()

			let next = () => router[method](href, options)
			if (method === 'back') next = () => router.back()

			// For back navigation, trigger transition
			if (method === 'back') {
				setStage('leaving')
				leaveRef.current = yield builtInLeave(next, pathname, href)
				return
			}

			// handle case where href is undefined
			if (!href) {
				next()
				return
			}

			// skip transition for hash-only links
			if (href.startsWith('#')) {
				next()
				return
			}

			let target
			let current
			try {
				current = new URL(window.location.href)
				target = new URL(href, current)
			} catch (error) {
				next()
				return
			}

			const isSamePage =
				target.pathname === current.pathname && target.search === current.search && target.hash === current.hash
			const isSamePathDifferentParams =
				target.pathname === current.pathname && (target.search !== current.search || target.hash !== current.hash)

			if (
				target.origin === current.origin && // same origin
				!isSamePage && // not link to self
				!isSamePathDifferentParams // not same pathname but different params
			) {
				setStage('leaving')
				leaveRef.current = yield builtInLeave(next, pathname, href)
			} else {
				next()
			}
		}),
		[builtInLeave, router, stage]
	)

	const handleClick = useCallback(
		(event) => {
			const link = event.delegateTarget
			let href = link == null ? void 0 : link.getAttribute('href')
			const ignore = link == null ? void 0 : link.getAttribute('data-transition-ignore') // ignore only works in auto mode
			if (!ignore && shouldLinkTriggerTransition(link, event)) {
				// Strip basePath from the DOM href since router.push() will re-add it
				const basePath = process.env.__NEXT_ROUTER_BASEPATH || ''
				if (basePath && href && href.startsWith(basePath)) {
					href = href.slice(basePath.length) || '/'
				}
				// Skip if clicking a link to the current page
				try {
					const target = new URL(href, window.location.href)
					const current = new URL(window.location.href)
					if (target.pathname === current.pathname && target.search === current.search && target.hash === current.hash) {
						return
					}
				} catch (_) {}
				event.preventDefault()
				navigate(href, pathname)
			}
		},
		[navigate, pathname]
	)

	useEffect(() => {
		if (!auto) return
		const controller = new AbortController()
		delegate('a[href]', 'click', handleClick, {
			signal: controller.signal,
		})
		return () => {
			controller.abort()
		}
	}, [auto, handleClick])

	useEffect(() => {
		if (stage === 'entering') {
			if (typeof leaveRef.current === 'function') leaveRef.current()
			leaveRef.current = null
			const runEnter = _async_to_generator(function* () {
				enterRef.current = yield Promise.resolve(
					builtInEnter(() => {
						setStage('none')
					})
				)
			})
			runEnter()
		}
	}, [stage, builtInEnter])

	// Handle browser back/forward navigation - mark popstate flag
	useEffect(() => {
		const handlePopState = () => {
			// Mark that we're in a popstate navigation
			// This is set early and used by the pathname change detector
			isPopStateRef.current = true
		}

		// Use both capture and bubble phase to ensure we catch it
		window.addEventListener('popstate', handlePopState, false)
		return () => {
			window.removeEventListener('popstate', handlePopState, false)
		}
	}, [])

	// Detect pathname changes and trigger entering stage
	useEffect(() => {
		// Check if pathname changed and we're in leaving stage (from any navigation)
		if (pathname !== previousPathnameRef.current) {
			// Clear any existing transition timeout
			if (transitionTimeoutRef.current) {
				clearTimeout(transitionTimeoutRef.current)
				transitionTimeoutRef.current = null
			}

			if (stage === 'leaving') {
				// Pathname changed while leaving - trigger entering stage
				if (typeof leaveRef.current === 'function') leaveRef.current()
				leaveRef.current = null
				setStage('entering')
			} else if (isPopStateRef.current) {
				// Popstate happened but stage isn't leaving yet (race condition)
				// Wait a bit and check again, or force entering stage
				const checkStage = () => {
					setStage('entering')
				}
				// Give it one frame to reach leaving stage, then force entering
				requestAnimationFrame(checkStage)
			}

			// Reset popstate flag if it was set
			if (isPopStateRef.current) {
				isPopStateRef.current = false
			}
		}

		previousPathnameRef.current = pathname
	}, [pathname, stage])

	// Capture page state before popstate navigation
	useEffect(() => {
		const captureBeforePopState = () => {
			// This runs synchronously when popstate fires, before Next.js updates
			const content = document.querySelector('[data-page-content]')
			if (!content) return

			// Check if we already have an old page clone - if so, skip creating another
			const existingOldPage = document.querySelector('[data-old-page]')
			if (existingOldPage) {
				// Already have a clone, just mark popstate and return
				isPopStateRef.current = true
				return
			}

			// Clean up any existing overlays
			const existingOverlays = document.querySelectorAll('.page-transition-overlay')
			existingOverlays.forEach((overlay) => overlay.remove())

			const scrollY = window.scrollY

			// Create viewport wrapper and clone immediately (synchronously)
			const viewportWrapper = document.createElement('div')
			viewportWrapper.setAttribute('data-old-page', 'true')
			viewportWrapper.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        pointer-events: none;
        z-index: 9999;
      `

			const oldPageClone = content.cloneNode(true)
			oldPageClone.removeAttribute('data-page-content')
			oldPageClone.style.cssText = `
        position: absolute;
        top: ${-scrollY}px;
        left: 0;
        width: 100%;
        pointer-events: none;
      `

			viewportWrapper.appendChild(oldPageClone)
			document.body.appendChild(viewportWrapper)

			// Hide the original content immediately
			content.style.opacity = '0'

			// Mark as in popstate for the pathname effect to handle
			isPopStateRef.current = true

			// Set stage and run animations in next tick
			requestAnimationFrame(() => {
				setStage('leaving')

				// Run leave animation if provided
				const currentMode = mode
				const currentLeave = leave
				if (currentMode === 'in-out' && currentLeave) {
					currentLeave(() => {}).catch((err) => console.error('Leave animation error:', err))
				}

				// Store the leave callback for cleanup
				leaveRef.current = () => {}
			})
		}

		// Use capture phase to ensure we run before Next.js
		window.addEventListener('popstate', captureBeforePopState, true)
		return () => {
			window.removeEventListener('popstate', captureBeforePopState, true)
		}
	}, [mode, leave])

	const value = useMemo(
		() => ({
			stage,
			navigate,
			isReady: stage !== 'entering',
		}),
		[stage, navigate]
	)

	// Make initial page visible on mount and after transitions
	useEffect(() => {
		const content = document.querySelector('[data-page-content]')
		if (content && stage === 'none') {
			content.style.visibility = 'visible'
		}
	}, [stage])

	// Add/remove transitioning class on body based on stage
	useEffect(() => {
		if (stage === 'leaving' || stage === 'entering') {
			document.body.classList.add('transitioning')

			// Safety timeout: if stuck in transitioning state for too long, force reset
			if (transitionTimeoutRef.current) {
				clearTimeout(transitionTimeoutRef.current)
			}

			transitionTimeoutRef.current = setTimeout(() => {
				console.warn('Transition timeout - forcing reset to "none" stage')

				// Clean up any old pages
				const existingOldPages = document.querySelectorAll('[data-old-page]')
				existingOldPages.forEach((page) => page.remove())

				const existingOverlays = document.querySelectorAll('.page-transition-overlay')
				existingOverlays.forEach((overlay) => overlay.remove())

				// Reset content opacity
				const content = document.querySelector('[data-page-content]')
				if (content) {
					content.style.opacity = ''
					content.style.position = ''
					content.style.top = ''
					content.style.left = ''
					content.style.width = ''
					content.style.height = ''
					content.style.zIndex = ''
				}

				setStage('none')
				transitionTimeoutRef.current = null
			}, 5000) // 5 second timeout
		} else {
			document.body.classList.remove('transitioning')

			// Clear timeout when transition completes normally
			if (transitionTimeoutRef.current) {
				clearTimeout(transitionTimeoutRef.current)
				transitionTimeoutRef.current = null
			}
		}

		// Cleanup on unmount
		return () => {
			if (transitionTimeoutRef.current) {
				clearTimeout(transitionTimeoutRef.current)
				transitionTimeoutRef.current = null
			}
		}
	}, [stage])

	return jsx(TransitionRouterContext.Provider, {
		value: value,
		children: children,
	})
}

function useTransitionState() {
	return use(TransitionRouterContext)
}

const _extends =
	Object.assign ||
	function (target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i]
			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key]
				}
			}
		}
		return target
	}

function getUrlAsString(url) {
	if (typeof url === 'string') return url
	return format(url)
}

function useTransitionRouter() {
	const router = useRouter()
	const pathname = usePathname()
	const { navigate } = useTransitionState()

	const push = useCallback(
		(href, options) => {
			navigate(getUrlAsString(href), pathname, 'push', options)
		},
		[pathname, navigate]
	)

	const replace = useCallback(
		(href, options) => {
			navigate(getUrlAsString(href), pathname, 'replace', options)
		},
		[pathname, navigate]
	)

	const back = useCallback(() => {
		navigate(undefined, pathname, 'back')
	}, [pathname, navigate])

	return useMemo(
		() =>
			_extends({}, router, {
				push,
				replace,
				back,
			}),
		[router, push, replace, back]
	)
}

function Link(props) {
	const router = useTransitionRouter()
	const pathname = usePathname()
	const { href, as, replace, scroll } = props

	const onClick = useCallback(
		(e) => {
			if (props.onClick) props.onClick(e)
			if (e.defaultPrevented) return

			const link = e.currentTarget
			if (!shouldLinkTriggerTransition(link, e)) return

			const targetHref = as || href

			// Skip if navigating to the current page
			try {
				const target = new URL(getUrlAsString(targetHref), window.location.href)
				const current = new URL(window.location.href)
				if (target.pathname === current.pathname && target.search === current.search && target.hash === current.hash) {
					return
				}
			} catch (_) {}

			e.preventDefault()
			const nav = replace ? router.replace : router.push
			nav(targetHref, { scroll: scroll != null ? scroll : true })
		},
		[props.onClick, href, as, replace, scroll, router.replace, router.push, pathname]
	)

	return jsx(
		NextLink,
		_extends({}, props, {
			onClick,
		})
	)
}

export { Link, TransitionRouter, useTransitionRouter, useTransitionState }
