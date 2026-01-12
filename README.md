# Next.js Page Transitions

Smooth, customizable page transitions for Next.js 16+ App Router with GSAP animation support.

## Features

- **Zero Config** - Works out of the box with sensible defaults
- **GSAP Powered** - Leverage GSAP's animation capabilities for smooth transitions
- **Two Transition Modes** - `in-out` (new page slides over old) or `out-in` (old page exits first)
- **Automatic Link Handling** - Intercepts Next.js Link clicks automatically
- **Browser Navigation Support** - Handles back/forward button transitions
- **Custom Animations** - Fully customizable leave and enter animations

## Installation

```bash
npm install
```

## Quick Start

### 1. Setup TransitionRouter

Wrap your app in the `TransitionRouter` component in your root layout:

```jsx
'use client'

import { TransitionRouter } from '@/src/components/TransitionRouter'
import { gsap } from 'gsap'
import { useCallback } from 'react'

export default function RootLayout({ children }) {
  const leave = useCallback(async (next) => {
    const oldPage = document.querySelector('[data-old-page]')
    if (oldPage) {
      await gsap.to(oldPage, {
        opacity: 0,
        duration: 0.3,
      })
    }
    next()
  }, [])

  const enter = useCallback(async (next) => {
    const content = document.querySelector('[data-page-content]')
    if (content) {
      gsap.set(content, { opacity: 0 })
      await gsap.to(content, {
        opacity: 1,
        duration: 0.3,
      })
    }
    next()
  }, [])

  return (
    <html>
      <body>
        <TransitionRouter mode='in-out' leave={leave} enter={enter} auto>
          {children}
        </TransitionRouter>
      </body>
    </html>
  )
}
```

### 2. Add Template File

Create a `template.js` file in your app directory:

```jsx
'use client'

export default function Template({ children }) {
  return <div data-page-content>{children}</div>
}
```

### 3. Use Links

Use the custom `Link` component or Next.js links with `auto` mode:

```jsx
import { Link } from '@/src/components/TransitionRouter'

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </nav>
  )
}
```

## API Reference

### TransitionRouter

The main component that handles page transitions.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `leave` | `async (next) => void` | `undefined` | Animation function called when leaving a page |
| `enter` | `async (next) => void` | `undefined` | Animation function called when entering a page |
| `mode` | `'in-out' \| 'out-in' \| null` | `null` | Transition mode - determines overlap behavior |
| `auto` | `boolean` | `false` | Automatically intercept all link clicks |

#### Modes

- **`in-out`** - New page animates in while old page is still visible (crossfade/overlay effect)
- **`out-in`** - Old page animates out completely before new page animates in
- **`null`** - Custom mode - you control everything via leave/enter callbacks

### useTransitionRouter

Hook that returns a router object with transition-aware navigation methods.

```jsx
import { useTransitionRouter } from '@/src/components/TransitionRouter'

function MyComponent() {
  const router = useTransitionRouter()

  return (
    <button onClick={() => router.push('/about')}>
      Go to About
    </button>
  )
}
```

#### Methods

- `push(href, options)` - Navigate to a new page with transition
- `replace(href, options)` - Replace current page with transition
- `back()` - Navigate back with transition

### useTransitionState

Hook that returns the current transition state.

```jsx
import { useTransitionState } from '@/src/components/TransitionRouter'

function MyComponent() {
  const { stage, isReady } = useTransitionState()

  return (
    <div>
      Current stage: {stage} {/* 'none' | 'leaving' | 'entering' */}
      Ready: {isReady ? 'Yes' : 'No'}
    </div>
  )
}
```

### Link

Transition-aware Link component that wraps Next.js Link.

```jsx
import { Link } from '@/src/components/TransitionRouter'

<Link href="/about" replace scroll={false}>
  About
</Link>
```

Accepts all Next.js Link props.

## Animation Examples

### Fade Transition

```jsx
const leave = useCallback(async (next) => {
  const oldPage = document.querySelector('[data-old-page]')
  if (oldPage) {
    await gsap.to(oldPage, {
      opacity: 0,
      duration: 0.5,
    })
  }
  next()
}, [])

const enter = useCallback(async (next) => {
  const content = document.querySelector('[data-page-content]')
  if (content) {
    gsap.set(content, { opacity: 0 })
    await gsap.to(content, {
      opacity: 1,
      duration: 0.5,
    })
  }
  next()
}, [])
```

### Slide Up Transition

```jsx
const leave = useCallback(async (next) => {
  const oldPage = document.querySelector('[data-old-page]')
  if (oldPage) {
    // Add overlay fade
    const overlay = document.createElement('div')
    overlay.className = 'page-transition-overlay'
    oldPage.appendChild(overlay)

    await gsap.to(overlay, {
      opacity: 0.8,
      duration: 0.8,
    })
  }
  next()
}, [])

const enter = useCallback(async (next) => {
  const content = document.querySelector('[data-page-content]')
  if (content) {
    gsap.set(content, { y: '100%' })
    await gsap.to(content, {
      y: '0%',
      duration: 1,
      ease: 'power3.inOut',
    })
  }
  next()
}, [])
```

### Scale & Fade

```jsx
const leave = useCallback(async (next) => {
  const oldPage = document.querySelector('[data-old-page]')
  if (oldPage) {
    await gsap.to(oldPage, {
      scale: 0.9,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    })
  }
  next()
}, [])

const enter = useCallback(async (next) => {
  const content = document.querySelector('[data-page-content]')
  if (content) {
    gsap.set(content, { scale: 1.1, opacity: 0 })
    await gsap.to(content, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    })
  }
  next()
}, [])
```

## Advanced Usage

### Conditional Transitions

Skip transitions for specific links by adding `data-transition-ignore`:

```jsx
<Link href="/no-transition" data-transition-ignore="true">
  No Transition
</Link>
```

### Programmatic Navigation

```jsx
import { useTransitionRouter } from '@/src/components/TransitionRouter'

function MyComponent() {
  const router = useTransitionRouter()

  const handleClick = () => {
    // Your logic here
    router.push('/dashboard')
  }

  return <button onClick={handleClick}>Go to Dashboard</button>
}
```

### Loading States

```jsx
import { useTransitionState } from '@/src/components/TransitionRouter'

function LoadingIndicator() {
  const { stage } = useTransitionState()

  if (stage === 'leaving' || stage === 'entering') {
    return <div className="loading">Transitioning...</div>
  }

  return null
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires browser support for:
- ES6+ features
- GSAP 3.x

## Troubleshooting

### Transitions not working

1. Ensure you've added the `template.js` file with `data-page-content` attribute
2. Check that `'use client'` directive is present in your layout
3. Verify GSAP is installed and imported correctly

### Flickering during transitions

Make sure to call `next()` at the appropriate time in your animation callbacks:
- For `out-in` mode: Call `next()` after leave animation completes
- For `in-out` mode: Call `next()` after enter animation completes

### Back button transitions not working

The library automatically handles browser back/forward navigation. Ensure `mode='in-out'` is set if you want transitions on browser navigation.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [GSAP](https://greensock.com/gsap/)
- [React](https://react.dev/)
