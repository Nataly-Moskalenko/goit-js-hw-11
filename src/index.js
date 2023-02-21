import './sass/index.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiService from './api-service';
import galleryMarkup from './gallery-markup';

const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

const imagesApiService = new ApiService();
const gallery = new SimpleLightbox('.gallery a');

function renderGallery(imgs) {
  const markup = galleryMarkup(imgs);
  galleryContainer.insertAdjacentHTML('beforeend', markup);
  buttonLoadMore.classList.remove('hidden');
}

function onSearchForm(event) {
  event.preventDefault();
  galleryContainer.innerHTML = '';
  imagesApiService.searchQuery =
    event.currentTarget.elements.searchQuery.value.trim();
  imagesApiService.resetPage();
  imagesApiService
    .fetchImages()
    .then(imgs => {
      renderGallery(imgs);
      gallery.refresh();
    })
    .catch(error => onFetchError(error)); 
}

function onButtonLoadMore(event) {
  event.preventDefault();
  imagesApiService
    .fetchImages()
    .then(imgs => {
      renderGallery(imgs);
      gallery.refresh();
    })
    .catch(error => onFetchError(error));
}

function onFetchError(error) {
  console.error(error);  
  buttonLoadMore.classList.add('hidden'); 
}

searchForm.addEventListener('submit', onSearchForm);
buttonLoadMore.addEventListener('click', onButtonLoadMore);
