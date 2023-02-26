import Notiflix from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const KEY_API = '33747694-4a7d646e14d783512846269ff';
const BASE_URL = 'https://pixabay.com/api/';
const galleryContainer = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchImages() {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY_API}&q=${this.searchQuery}
      &image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`
    );
    const data = await response.data;

    if (data.totalHits === 0) {
      Notiflix.Notify.failure(
        "Sorry, there are no images matching your search query. Please try again.'"
      );
      galleryContainer.innerHTML = '';
    } else {
      if (data.totalHits <= this.perPage) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        buttonLoadMore.classList.add('hidden');
      } else if (this.page === 1 && data.totalHits > this.perPage) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        buttonLoadMore.classList.remove('hidden');
      } else if (
        this.page > 1 &&
        this.page === Math.ceil(data.totalHits / this.perPage)
      ) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        buttonLoadMore.classList.add('hidden');
      }

      this.incrementPage();
      return data.hits;
    }
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
