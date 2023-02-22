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

function scrollGallery() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  return window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
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
      scrollGallery();
    })
    .catch(error => onFetchError(error));
}

function onFetchError(error) {
  console.error(error);
  buttonLoadMore.classList.add('hidden');
}

searchForm.addEventListener('submit', onSearchForm);
buttonLoadMore.addEventListener('click', onButtonLoadMore);
galleryContainer.addEventListener("wheel", scrollGallery);