import Notiflix from 'notiflix/build/notiflix-notify-aio';

const KEY_API = '33747694-4a7d646e14d783512846269ff';
const BASE_URL = 'https://pixabay.com/api/';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  fetchImages() {
    return fetch(
      `${BASE_URL}?key=${KEY_API}&q=${this.searchQuery}
      &image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
    )
      .then(response => response.json())
      .then(data => {
        if (data.totalHits === 0) {
          galleryContainer.innerHTML = '';
          buttonLoadMore.classList.add('hidden');
          Notiflix.Notify.failure(
            "Sorry, there are no images matching your search query. Please try again.'"
          );
        } else {
          if (this.page === 1) {
            Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
          }
          this.incrementPage();
          return data.hits;
        }
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
