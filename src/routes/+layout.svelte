<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser, isAuthenticated } from '$lib/stores/user';
	import { initializeSocket } from '$lib/stores/socket';
	import '../app.css';

	let { children } = $props();

	onMount(async () => {
		// Check authentication status and initialize user
		try {
			const response = await fetch('/api/auth/me');
			if (response.ok) {
				const userData = await response.json();
				if (userData.success) {
					currentUser.set(userData.data);
					isAuthenticated.set(true);
					
					// Initialize Socket.io connection
					initializeSocket(userData.data.id);
				}
			}
		} catch (error) {
			console.error('Failed to check authentication:', error);
		}
	});
</script>

<div class="app">
	<header class="header">
		<nav class="nav">
			<div class="nav-brand">
				<a href="/" class="brand-link">
					🎴 Pokemon TCG Trader
				</a>
			</div>
			
			<div class="nav-links">
				<a href="/listings" class="nav-link">Browse Trades</a>
				<a href="/wonder-picks" class="nav-link">Wonder Picks</a>
				<a href="/messages" class="nav-link">Messages</a>
			</div>
			
			<div class="nav-auth">
				{#if $isAuthenticated}
					<div class="user-menu">
						<span class="username">Welcome, {$currentUser?.username}!</span>
						<a href="/profile" class="nav-link">Profile</a>
						<a href="/api/auth/logout" class="nav-link">Logout</a>
					</div>
				{:else}
					<a href="/api/auth/login" class="auth-button">Login</a>
				{/if}
			</div>
		</nav>
	</header>

	<main>
		{@render children()}
	</main>

	<footer class="footer">
		<div class="footer-content">
			<p>&copy; 2025 Pokemon TCG Trader. Made for the Pokemon TCG Pocket community.</p>
			<div class="footer-links">
				<a href="/about">About</a>
				<a href="/privacy">Privacy</a>
				<a href="/terms">Terms</a>
			</div>
		</div>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: #f8fafc;
	}

	.header {
		background: white;
		border-bottom: 1px solid #e2e8f0;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 2rem;
	}

	.brand-link {
		font-size: 1.5rem;
		font-weight: bold;
		color: #3b82f6;
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		gap: 2rem;
	}

	.nav-link {
		color: #64748b;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.nav-link:hover {
		color: #3b82f6;
	}

	.nav-auth {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.user-menu {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.username {
		color: #374151;
		font-weight: 500;
	}

	.auth-button {
		background: #3b82f6;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		text-decoration: none;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.auth-button:hover {
		background: #2563eb;
	}

	main {
		flex: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		width: 100%;
		box-sizing: border-box;
	}

	.footer {
		background: #1f2937;
		color: #9ca3af;
		padding: 2rem;
		margin-top: auto;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.footer-links {
		display: flex;
		gap: 2rem;
	}

	.footer-links a {
		color: #9ca3af;
		text-decoration: none;
		transition: color 0.2s;
	}

	.footer-links a:hover {
		color: #f3f4f6;
	}

	@media (max-width: 768px) {
		.nav {
			flex-direction: column;
			gap: 1rem;
			padding: 1rem;
		}

		.nav-links {
			gap: 1rem;
		}

		.footer-content {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}

		main {
			padding: 1rem;
		}
	}
</style>
