<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser, isAuthenticated } from '$lib/stores/user';
	import { initializeSocket } from '$lib/stores/socket';
	import '../app.css';

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

<div class="flex flex-col min-h-screen bg-slate-50">
	<header class="bg-white border-b border-slate-200 shadow-sm">
		<nav class="flex items-center justify-between max-w-6xl mx-auto px-6 py-4">
			<div class="flex items-center">
				<a href="/" class="text-2xl font-bold text-primary-500 hover:text-primary-600 transition-colors">
					🎴 Pokemon TCG Trader
				</a>
			</div>
			
			<div class="hidden md:flex items-center space-x-8">
				<a href="/listings" class="nav-link">Browse Trades</a>
				<a href="/wonder-picks" class="nav-link">Wonder Picks</a>
				<a href="/messages" class="nav-link">Messages</a>
			</div>
			
			<div class="flex items-center space-x-4">
				{#if $isAuthenticated}
					<div class="flex items-center space-x-4">
						<span class="text-slate-700 font-medium">Welcome, {$currentUser?.username}!</span>
						<a href="/profile" class="nav-link">Profile</a>
						<a href="/api/auth/logout" class="nav-link">Logout</a>
					</div>
				{:else}
					<a href="/api/auth/login" class="btn-primary">Login</a>
				{/if}
			</div>
		</nav>

		<!-- Mobile menu -->
		<div class="md:hidden border-t border-slate-200 px-6 py-4">
			<div class="flex flex-col space-y-3">
				<a href="/listings" class="nav-link">Browse Trades</a>
				<a href="/wonder-picks" class="nav-link">Wonder Picks</a>
				<a href="/messages" class="nav-link">Messages</a>
			</div>
		</div>
	</header>

	<main class="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
		<slot />
	</main>

	<footer class="bg-slate-800 text-slate-300 py-8 mt-auto">
		<div class="max-w-6xl mx-auto px-6">
			<div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
				<p class="text-center md:text-left">
					&copy; 2025 Pokemon TCG Trader. Made for the Pokemon TCG Pocket community.
				</p>
				<div class="flex space-x-6">
					<a href="/about" class="text-slate-400 hover:text-slate-200 transition-colors">About</a>
					<a href="/privacy" class="text-slate-400 hover:text-slate-200 transition-colors">Privacy</a>
					<a href="/terms" class="text-slate-400 hover:text-slate-200 transition-colors">Terms</a>
				</div>
			</div>
		</div>
	</footer>
</div>


