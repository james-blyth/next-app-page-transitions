/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	basePath: '/next-app-page-transitions',
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	images: {
		formats: ['image/avif', 'image/webp'],
		unoptimized: true,
	},
}

module.exports = nextConfig
