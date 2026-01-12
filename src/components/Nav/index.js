import Link from 'next/link'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/">Home</Link>
      <span className={styles.separator}>|</span>
      <Link href="/about">About</Link>
    </nav>
  )
}
