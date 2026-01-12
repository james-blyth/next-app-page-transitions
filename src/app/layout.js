'use client'

import './globals.css'
import { TransitionRouter } from '@/src/components/TransitionRouter'
import Nav from '@/src/components/Nav'
import { gsap } from 'gsap'
import { useCallback } from 'react'

export default function RootLayout({ children }) {
	// Leave animation - add black overlay within cloned old page
	const leave = useCallback(async (next) => {
		// Kill any running animations first (centralized cleanup)
		gsap.killTweensOf('.page-transition-overlay')
		gsap.killTweensOf('[data-page-content]')
		gsap.killTweensOf('[data-old-page]')

		// Clean up any orphaned overlays
		document.querySelectorAll('.page-transition-overlay').forEach((el) => el.remove())

		const oldPage = document.querySelector('[data-old-page]')
		if (oldPage) {
			// Create black overlay as a child of the old page clone
			const overlay = document.createElement('div')
			overlay.className = 'page-transition-overlay'

			oldPage.appendChild(overlay)

			// Start fading overlay in (don't wait)
			gsap.to(overlay, {
				opacity: 0.8,
				duration: 0.8,
				ease: 'power2.inOut',
			})
		}

		// Proceed with navigation
		next()
	}, [])

	// Enter animation - slide new page up from bottom
	const enter = useCallback(async (next) => {
		const content = document.querySelector('[data-page-content]')

		if (content) {
			// Kill any running animations on this element
			gsap.killTweensOf(content)

			// Set initial state: position at bottom and make visible
			gsap.set(content, {
				y: '100%',
				visibility: 'visible',
			})

			// Small delay to ensure positioning is applied
			await new Promise((resolve) => setTimeout(resolve, 10))

			// Slide new page up from bottom
			await gsap.to(content, {
				y: '0%',
				duration: 1,
				ease: 'power3.inOut',
			})

			next()
		} else {
			next()
		}
	}, [])

	return (
		<html lang='en'>
			<body>
				<Nav />
				<TransitionRouter mode='in-out' leave={leave} enter={enter} auto>
					{children}
				</TransitionRouter>
			</body>
		</html>
	)
}
