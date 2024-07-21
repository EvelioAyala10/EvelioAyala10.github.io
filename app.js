if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section');
    const searchBar = document.getElementById('search-bar');
    const filterGenre = document.getElementById('filter-genre');
    const filterYear = document.getElementById('filter-year');
    const videoSection = document.getElementById('video-section');
    const moviePlayer = document.getElementById('movie-player');
    const movieDetails = document.getElementById('movie-details');
    const backButton = document.getElementById('back-button');
    const addToFavoritesButton = document.getElementById('add-to-favorites');
    const themeToggle = document.getElementById('theme-toggle');
    const bannerSection = document.getElementById('home');
    const nextPageButton = document.getElementById('next-page');
    const moviesGrid = document.getElementById('movies-grid');
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let currentPage = 0;
    const bannersPerPage = 10;

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            if (targetId === 'movies') {
                renderMovies(currentPage);
            }
        });
    });

    searchBar.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();
        const banners = document.querySelectorAll('.banner');
        banners.forEach(banner => {
            const title = banner.querySelector('p').textContent.toLowerCase();
            banner.style.display = title.includes(query) ? 'block' : 'none';
        });
    });

    filterGenre.addEventListener('change', filterMovies);
    filterYear.addEventListener('change', filterMovies);

    function filterMovies() {
        const genre = filterGenre.value.toLowerCase();
        const year = filterYear.value;
        const banners = document.querySelectorAll('.banner');

        banners.forEach(banner => {
            const bannerGenre = banner.dataset.genre ? banner.dataset.genre.toLowerCase() : '';
            const bannerYear = banner.dataset.year ? banner.dataset.year : '';

            const genreMatch = genre === '' || bannerGenre === genre;
            const yearMatch = year === '' || bannerYear === year;

            if (genreMatch && yearMatch) {
                banner.style.display = 'block';
            } else {
                banner.style.display = 'none';
            }
        });
    }

    const renderMovies = (page) => {
        const banners = Array.from(moviesGrid.children);
        banners.forEach((banner, index) => {
            if (index >= page * bannersPerPage && index < (page + 1) * bannersPerPage) {
                banner.style.display = 'block';
            } else {
                banner.style.display = 'none';
            }
        });
    };

    nextPageButton.addEventListener('click', () => {
        currentPage++;
        renderMovies(currentPage);
        if ((currentPage + 1) * bannersPerPage >= moviesGrid.children.length) {
            nextPageButton.style.display = 'none';
        }
    });

    bannerSection.addEventListener('click', (event) => {
        if (event.target.closest('.banner')) {
            const banner = event.target.closest('.banner');
            const movieUrl = banner.dataset.movie;
            const details = banner.dataset.details;
            playMovie(movieUrl, details);
        }
    });

    moviesGrid.addEventListener('click', (event) => {
        if (event.target.closest('.banner')) {
            const banner = event.target.closest('.banner');
            const movieUrl = banner.dataset.movie;
            const details = banner.dataset.details;
            playMovie(movieUrl, details);
        }
    });

    const playMovie = (url, details) => {
        moviePlayer.src = url;
        movieDetails.textContent = details;
        sections.forEach(section => section.classList.remove('active'));
        videoSection.classList.add('active');
    };

    backButton.addEventListener('click', () => {
        moviePlayer.src = '';
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById('home').classList.add('active');
    });

    addToFavoritesButton.addEventListener('click', () => {
        const currentMovieUrl = moviePlayer.src;
        if (!favorites.includes(currentMovieUrl)) {
            favorites.push(currentMovieUrl);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        }
    });

    const renderFavorites = () => {
        const favoritesList = document.getElementById('favorites-list');
        favoritesList.innerHTML = '';
        favorites.forEach(favorite => {
            const favoriteItem = document.createElement('div');
            favoriteItem.classList.add('favorite-item');
            favoriteItem.textContent = favorite;
            favoriteItem.addEventListener('click', () => {
                playMovie(favorite, '');
            });
            favoritesList.appendChild(favoriteItem);
        });
    };

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });

    renderMovies(currentPage);
    renderFavorites();
});