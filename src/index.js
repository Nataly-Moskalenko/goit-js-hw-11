import Notiflix from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.css';

const form = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');
// const KEY_QUERY = '33747694-4a7d646e14d783512846269ff';

buttonLoadMore.hidden = true;
// new SimpleLightbox('.gallery a');

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
            <img class="gallery__image" src="${webformatURL}" alt="${tags}" title="${tags}" loading="lazy" />
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
  // galleryContainer.insertAdjacentHTML('beforeend', markup);
  galleryContainer.innerHTML = markup;
  buttonLoadMore.hidden = false;
}

function onFormSubmit(event) {
  event.preventDefault();
  const { searchQuery } = event.currentTarget;
  fetch(
    `https://pixabay.com/api/?key=33747694-4a7d646e14d783512846269ff&q=${searchQuery.value}
    &image_type=photo&orientation=horizontal&safesearch=true&per_page=3&page=1`
  )
    .then(response => response.json())
    .then(data => {
      if (data.totalHits === 0) {
        galleryContainer.innerHTML = '';
        buttonLoadMore.hidden = true;
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else return data.hits;
    })
    .then(imgs => renderGallery(imgs))
    .catch(error => onFetchError(error));
}

// function onButtonLoadMore(event) {
//   event.preventDefault();
//   fetch(
//     `https://pixabay.com/api/?key=33747694-4a7d646e14d783512846269ff&q=${searchQuery.value}
//     &image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=2`
//   )
//     .then(response => response.json())
//     .then(data => data.hits)
//     .then(imgs => renderGallery(imgs))
//     .catch(error => onFetchError(error));
// }

function onFetchError(error) {
  console.error(error);
  // galleryContainer.innerHTML = '';
  // buttonLoadMore.hidden = true;
  // Notiflix.Notify.failure(
  //   'Sorry, there are no images matching your search query. Please try again.'
  // );
}

form.addEventListener('submit', onFormSubmit);
// buttonLoadMore.addEventListener('click', onButtonLoadMore);
// 33747694-4a7d646e14d783512846269ff

// galleryContainer.insertAdjacentHTML('beforeend', cardsMarkup);
const gallery = new SimpleLightbox('.gallery a');
// gallery.refresh();