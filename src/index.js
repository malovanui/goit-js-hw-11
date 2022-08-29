import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchForm: document.querySelector('#search-form'),
    galleryList: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('#load-more')
};


const MAIN_URL = 'https://pixabay.com/api/';
const API_KEY = '29559707-0699ce43e90ab6bdbba4cd5fc';
let currentPage = 1;
let query = undefined;
// ----- Functions

const createGalleryMarkup = (imagesData) => {

     const markup = imagesData.map(({ webformatURL, previewWidth, largeImageURL, tags, likes, views, comments, downloads }) => { return `
     
     <a href="${largeImageURL}" class="gallery__link">
            <div class="gallery__photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" width="${previewWidth}" />
            <div class="info">
                <p class="info-item">
                <b>Likes</b></br>
                ${likes}
                </p>
                <p class="info-item">
                <b>Views</b></br>
                ${views}
                </p>
                <p class="info-item">
                <b>Comments</b></br>
                ${comments}
                </p>
                <p class="info-item">
                <b>Downloads</b></br>
                ${downloads}
                </p>
            </div>
            </div>
            </a>
          
    `
    }).join('');

    refs.galleryList.insertAdjacentHTML('beforeend', markup);
    refs.loadMoreBtn.style.display = 'block';
    
 };

const getGalleryList = async (query) => {
    const params = new URLSearchParams({
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: 40,
    });

    const response = await axios.get(`${MAIN_URL}?${params}`);
    const imagesData = response.data.hits;
    

    console.log(response);
    createGalleryMarkup(imagesData);

    Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);

    if (response.data.total === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');
    }
    
    if (currentPage * 40 >= response.data.totalHits) {
        refs.loadMoreBtn.style.display = 'none';
        Notiflix.Notify.failure('We`re sorry, but you`ve reached the end of search results');
    }
};

const onSearchSubmit = (e) => {
    e.preventDefault();
    query = e.target.elements.searchQuery.value.trim();

    if (!query) {
        refs.loadMoreBtn.style.display = 'none';
        return refs.galleryList.innerHTML = '';
    }

    currentPage = 1;
    refs.galleryList.innerHTML = '';
    getGalleryList(query);
};


const onLoadMore = () => { 
    currentPage += 1;
    getGalleryList(query);
};


const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

//----- Event Listeners
refs.searchForm.addEventListener('submit', onSearchSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
// refs.galleryList.addEventListener('click', lightbox);