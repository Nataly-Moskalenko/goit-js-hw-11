import Notiflix from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.css';
import ApiService from './api-service';

const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

const imagesApiService = new ApiService();
const gallery = new SimpleLightbox('.gallery a');

buttonLoadMore.classList.add('hidden');

function renderGallery(imgs) {
  const markup = imgs
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `        
        <a href="${largeImageURL}" class="gallery__item">
          <div class="photo__card">
            <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info__item">
                <b>Likes</b>
                <span>${likes}</span>
              </p>
              <p class="info__item">
                <b>Views</b>
                <span>${views}</span>
              </p>
              <p class="info__item">
                <b>Comments</b>
                <span>${comments}</span>
              </p>
              <p class="info__item">
                <b>Downloads</b>
                <span>${downloads}</span>
              </p>
            </div>           
          </div>
        </a>
    `;
      }
    )
    .join('');  
  galleryContainer.insertAdjacentHTML('beforeend', markup);  
  buttonLoadMore.classList.remove('hidden');
}

function onSearchForm(event) {
  event.preventDefault();
  galleryContainer.innerHTML = '';
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
    })
    .catch(error => onFetchError(error));
}

function onFetchError(error) {
  console.error(error);
}

searchForm.addEventListener('submit', onSearchForm);
buttonLoadMore.addEventListener('click', onButtonLoadMore);
