/** @type {import('next').NextConfig} */
const nextConfig = {
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	images: {
		formats: ['image/avif', 'image/webp'],
	},
}

module.exports = nextConfig
