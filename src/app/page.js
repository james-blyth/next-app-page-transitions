import styles from './page.module.css'

export default function HomePage() {
	return (
		<div className={`${styles.root} ${styles.home}`}>
			<div className={styles.container}>
				<h1 className={styles.pageTitle}>Home Page</h1>
				<p className={styles.pageDescription}>Navigate to see the smooth crossfade transition!</p>

				<section style={{ marginTop: '3rem' }}>
					<h2>Introduction</h2>
					<p>
						This is an extended home page with lots of content to test scroll position handling during page transitions.
						The transition system should maintain your scroll position when you navigate between pages.
					</p>

					<h2>Section 1: Getting Started</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
						dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
						ea commodo consequat.
					</p>
					<p>
						Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
						Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
						laborum.
					</p>

					<h2>Section 2: Features</h2>
					<p>
						Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
						aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
					</p>
					<p>
						Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
						dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
						sit amet.
					</p>

					<h2>Section 3: Advanced Usage</h2>
					<p>
						At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
						atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
					</p>
					<p>
						Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem
						rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque
						nihil impedit.
					</p>

					<h2>Section 4: Best Practices</h2>
					<p>
						Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates
						repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.
					</p>
					<p>
						Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
						dolore magna aliqua.
					</p>

					<h2>Section 5: Troubleshooting</h2>
					<p>
						Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel
						illum qui dolorem eum fugiat quo voluptas nulla pariatur. Excepteur sint occaecat cupidatat non proident.
					</p>
					<p>
						Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus
						error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
						veritatis.
					</p>

					<h2>Section 6: API Reference</h2>
					<p>
						Et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
						aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi
						nesciunt.
					</p>
					<p>
						Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non
						numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
					</p>

					<h2>Section 7: Performance</h2>
					<p>
						Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex
						ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.
					</p>
					<p>
						Quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos
						et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque
						corrupti.
					</p>

					<h2>Conclusion</h2>
					<p>
						This extended content allows you to scroll down the page and then navigate to test whether the scroll
						position is properly maintained during the page transition animation. Try scrolling to different positions
						and clicking the navigation links.
					</p>
				</section>
			</div>
		</div>
	)
}
