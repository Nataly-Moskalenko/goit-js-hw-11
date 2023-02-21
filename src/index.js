import Notiflix from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.css';
import ApiService from './api-service';
import galleryMarkup from './gallery-markup';

const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

const imagesApiService = new ApiService();
const gallery = new SimpleLightbox('.gallery a');

buttonLoadMore.classList.add('hidden');

function renderGallery(imgs) {
  const markup = galleryMarkup(imgs);
  galleryContainer.insertAdjacentHTML('beforeend', markup);
  buttonLoadMore.classList.remove('hidden');
}

function clearGallery() {
  galleryContainer.innerHTML = '';
}

// function endGallery() {
//   // if (this.page > Math.ceil(data.totalHits / 40)) {
//     buttonLoadMore.classList.add('hidden');
//     Notiflix.Notify.info(
//       "We're sorry, but you've reached the end of search results."
//     );
//   }
// // }

function onSearchForm(event) {
  event.preventDefault();
  clearGallery();
  imagesApiService.searchQuery = event.currentTarget.elements.searchQuery.value;
  imagesApiService.resetPage();
  imagesApiService
    .fetchImages()
    .then(imgs => {
      renderGallery(imgs);
      gallery.refresh();
      
    })
    .catch(error => onFetchError(error));
  // .finally(() => form.reset());
}

function onButtonLoadMore(event) {
  event.preventDefault();
  imagesApiService
    .fetchImages()
    .then(imgs => {
      renderGallery(imgs);
      gallery.refresh();
      // if (this.page === Math.ceil(data.totalHits / 40)) {
      //   if (data.totalHits === data.hits.length) {
      // endGallery();
      // }
    })
    .catch(error => onFetchError(error));
}

function onFetchError(error) {
  console.error(error);
  clearGallery();
  buttonLoadMore.classList.add('hidden');
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

searchForm.addEventListener('submit', onSearchForm);
buttonLoadMore.addEventListener('click', onButtonLoadMore);
