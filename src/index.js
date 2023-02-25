import './sass/index.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';
import ApiService from './api-service';
import galleryMarkup from './gallery-markup';

const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

const imagesApiService = new ApiService();
const gallery = new SimpleLightbox('.gallery a');

function renderGalleryOnsearchForm(imgs) {
  const markup = galleryMarkup(imgs);
  galleryContainer.innerHTML = markup;
}

function renderGalleryOnButtonLoadMore(imgs) {
  const markup = galleryMarkup(imgs);
  galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function onSearchForm(event) {
  event.preventDefault();
  imagesApiService.searchQuery =
    event.currentTarget.elements.searchQuery.value.trim();
  imagesApiService.resetPage();
  imagesApiService
    .fetchImages()
    .then(imgs => {
      renderGalleryOnsearchForm(imgs);
      gallery.refresh();
    })
    .catch(error => onFetchError(error));
}

function onButtonLoadMore(event) {
  event.preventDefault();
  imagesApiService
    .fetchImages()
    .then(imgs => {
      renderGalleryOnButtonLoadMore(imgs);
      gallery.refresh();
      scrollGalleryOnClick();
    })
    .catch(error => onFetchError(error));
}

function onFetchError(error) {
  console.error(error);
  buttonLoadMore.classList.add('hidden');
}

function scrollGalleryOnWheel(event) {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  let scrollDirection;
  if (event.deltaY < 0) {
    scrollDirection = window.scrollBy({
      top: -cardHeight * 2,
      behavior: 'smooth',
    });
  } else {
    scrollDirection = window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
  return scrollDirection;
}

function scrollGalleryOnClick() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  return window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

searchForm.addEventListener('submit', onSearchForm);
buttonLoadMore.addEventListener('click', onButtonLoadMore);
galleryContainer.addEventListener('wheel', debounce(scrollGalleryOnWheel, 200));
