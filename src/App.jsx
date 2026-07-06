import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
	return (
		<>
			<div className='hero-container'>
				{/* Navbar Header */}
				<header className='hero-header'>
					<nav className='hero-nav'>
						<a href='#home' className='nav-link'>
							HOME
						</a>
						<a href='#jobs' className='nav-link'>
							FIND JOB
						</a>
						<a href='#reviews' className='nav-link'>
							REVIEWS
						</a>
					</nav>
					<div className='auth-buttons'>
						<button className='btn-signup'>SIGN UP</button>
						<button className='btn-login'>LONG IN</button>
					</div>
				</header>

				{/* Hero Content */}
				<div className='hero-content'>
					<h1 className='hero-title'>
						FIND YOUR NEXT <br /> JOB IN MINUTES.
					</h1>
					<p className='hero-subtitle'>
						THOUSANDS OF VERIFIED JOB, APPLY IN ONE CLICK
					</p>

					{/* Search Bar Form */}
					<div className='search-bar'>
						<div className='search-input-group'>
							<span className='input-icon'>🔍</span>
							<input
								type='text'
								placeholder='busqueda'
								className='search-input'
							/>
						</div>

						<div className='divider-line'></div>

						<div className='search-input-group'>
							<span className='input-icon'>📍</span>
							<input
								type='text'
								placeholder='city or location'
								className='search-input'
							/>
						</div>

						<button className='btn-find'>FIND NOW</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
