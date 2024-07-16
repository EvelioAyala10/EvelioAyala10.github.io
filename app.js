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
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const searchBar = document.getElementById('search-bar');
    const filterGenre = document.getElementById('filter-genre');
    const filterYear = document.getElementById('filter-year');
    const bannerSection = document.getElementById('movies');
    const videoSection = document.getElementById('video-section');
    const moviePlayer = document.getElementById('movie-player');
    const movieDetails = document.getElementById('movie-details');
    const backButton = document.getElementById('back-button');
    const addToFavoritesButton = document.getElementById('add-to-favorites');
    const favoritesList = document.getElementById('favorites-list');
    const themeToggle = document.getElementById('theme-toggle');

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    function renderFavorites() {
        favoritesList.innerHTML = '';
        favorites.forEach(favorite => {
            const banner = document.createElement('div');
            banner.classList.add('banner');
            banner.dataset.movie = favorite.movie;
            banner.dataset.details = favorite.title;

            const img = document.createElement('img');
            img.src = favorite.image;
            img.alt = favorite.title;

            const title = document.createElement('p');
            title.textContent = favorite.title;

            banner.appendChild(img);
            banner.appendChild(title);
            favoritesList.appendChild(banner);
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
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
            const bannerYear = banner.dataset.year || '';
            const matchGenre = genre === '' || bannerGenre.includes(genre);
            const matchYear = year === '' || bannerYear === year;
            banner.style.display = matchGenre && matchYear ? 'block' : 'none';
        });
    }

    function handleBannerClick(event) {
        const banner = event.target.closest('.banner');
        if (banner) {
            const movieSrc = banner.getAttribute('data-movie');
            const movieDetail = banner.getAttribute('data-details');
            moviePlayer.setAttribute('src', movieSrc);
            movieDetails.textContent = movieDetail;
            sections.forEach(section => section.classList.remove('active'));
            videoSection.style.display = 'block';
        }
    }

    document.getElementById('home').addEventListener('click', handleBannerClick);
    bannerSection.addEventListener('click', handleBannerClick);

    backButton.addEventListener('click', () => {
        videoSection.style.display = 'none';
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById('home').classList.add('active');
    });

    addToFavoritesButton.addEventListener('click', () => {
        const currentMovie = moviePlayer.getAttribute('src');
        const currentMovieTitle = movieDetails.textContent;
        const currentMovieBanner = document.querySelector(`.banner[data-movie="${currentMovie}"] img`);
        const currentMovieImage = currentMovieBanner ? currentMovieBanner.getAttribute('src') : '';

        const favorite = {
            movie: currentMovie,
            title: currentMovieTitle,
            image: currentMovieImage
        };

        if (!favorites.some(fav => fav.movie === currentMovie)) {
            favorites.push(favorite);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        }
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    renderFavorites();
});