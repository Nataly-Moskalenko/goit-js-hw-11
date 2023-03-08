import './sass/index.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';
import ApiService from './api-service';
import galleryMarkup from './gallery-markup';
import NotificationService from './notification-service';

const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

const imagesApiService = new ApiService();
const notificationService = new NotificationService();
const gallery = new SimpleLightbox('.gallery a');

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].intersectionRatio <= 0) return;
  refreshGalleryOnScroll();
});

intersectionObserver.observe(buttonLoadMore);

function renderGalleryOnSearchForm(imgs) {
  const markup = galleryMarkup(imgs);
  galleryContainer.innerHTML = markup;
}

function renderGalleryOnScroll(imgs) {
  const markup = galleryMarkup(imgs);
  galleryContainer.insertAdjacentHTML('beforeend', markup);
}

async function onSearchForm(event) {
  event.preventDefault();
  imagesApiService.searchQuery =
    event.currentTarget.elements.searchQuery.value.trim();

  if (imagesApiService.searchQuery === '') {
    notificationService.infoSearch();
    galleryContainer.innerHTML = '';
    buttonLoadMore.classList.add('hidden');
    return;
  }
  imagesApiService.resetPage();

  try {
    const { hits, totalHits } = await imagesApiService.fetchImages();
    renderGalleryOnSearchForm(hits);
    notificationService.notify(totalHits);
  } catch (error) {
    onFetchError(error);
  }
  gallery.refresh();
}

async function refreshGalleryOnScroll() {
  try {
    let page = imagesApiService.getPage();
    const { hits, totalHits } = await imagesApiService.fetchImages();
    renderGalleryOnScroll(hits);
    notificationService.notify(totalHits, page);
  } catch (error) {
    onFetchError(error);
  }
  gallery.refresh();
}

function onFetchError(error) {
  console.error(error);
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

searchForm.addEventListener('submit', onSearchForm);
galleryContainer.addEventListener('wheel', debounce(scrollGalleryOnWheel, 150));
