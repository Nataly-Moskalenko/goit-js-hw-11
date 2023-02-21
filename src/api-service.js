import Notiflix from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const KEY_API = '33747694-4a7d646e14d783512846269ff';
const BASE_URL = 'https://pixabay.com/api/';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchImages() {
    return await axios
      .get(
        `${BASE_URL}?key=${KEY_API}&q=${this.searchQuery}
      &image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
      )
      .then(response => {
        if (response.data.totalHits === 0) {
          Notiflix.Notify.failure(
            "Sorry, there are no images matching your search query. Please try again.'"
          );
        } else if (
          response.data.totalHits !== 0 &&
          response.data.hits.length === 0
        ) {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        } else {
          if (this.page === 1) {
            Notiflix.Notify.success(
              `Hooray! We found ${response.data.totalHits} images.`
            );
          }
          this.incrementPage();
          return response.data.hits;
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
