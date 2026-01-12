import styles from '../page.module.css'

export default function AboutPage() {
	return (
		<div className={`${styles.root} ${styles.about}`}>
			<div className={styles.container}>
				<h1 className={styles.pageTitle}>About Page</h1>
				<p className={styles.pageDescription}>Notice the smooth crossfade effect!</p>

				<section style={{ marginTop: '3rem' }}>
					<h2>About This Project</h2>
					<p>
						This page demonstrates the page transition system with extended content. Scroll to test how the transition
						handles different scroll positions across navigation events.
					</p>

					<h2>Our Story</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante
						dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.
					</p>
					<p>
						Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.
						Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
					</p>

					<h2>Our Mission</h2>
					<p>
						Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean
						quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem.
					</p>
					<p>
						Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non,
						massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel,
						tincidunt sed.
					</p>

					<h2>Our Team</h2>
					<p>
						Euismod in nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per
						conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis.
					</p>
					<p>
						Tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse
						potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam.
					</p>

					<h2>Our Values</h2>
					<p>
						Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus
						magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam.
					</p>
					<p>
						Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia
						molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum.
					</p>

					<h2>Our Approach</h2>
					<p>
						Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et,
						augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris.
					</p>
					<p>
						Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus.
						Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique.
					</p>

					<h2>Technology Stack</h2>
					<p>
						Dignissim in pretium. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer
						tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.
					</p>
					<p>
						Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi
						porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in.
					</p>

					<h2>Get Involved</h2>
					<p>
						Tempus sit amet sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis,
						turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue
						elementum.
					</p>
					<p>
						In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec
						condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque.
					</p>

					<h2>Contact Information</h2>
					<p>
						Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas
						metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget.
					</p>
					<p>
						This extended about page content gives you plenty of room to scroll and test the transition behavior at
						various scroll positions. Navigate back to the home page to see how the system handles the transition.
					</p>
				</section>
			</div>
		</div>
	)
}
