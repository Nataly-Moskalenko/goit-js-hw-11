import Notiflix from 'notiflix/build/notiflix-notify-aio';

const galleryContainer = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

export default class NotificationService {
  success(totalHits) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  info() {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  failure() {
    Notiflix.Notify.failure(
      "Sorry, there are no images matching your search query. Please try again.'"
    );
  }

  notify(totalHits, page = 1, perPage = 40) {
    if (totalHits === 0) {
      this.failure();
      galleryContainer.innerHTML = '';
      buttonLoadMore.classList.add('hidden');
      return;
    }

    if (totalHits <= perPage) {
      this.success(totalHits);
      buttonLoadMore.classList.add('hidden');
    } else if (page === 1 && totalHits > perPage) {
      this.success(totalHits);
      buttonLoadMore.classList.remove('hidden');
    } else if (page > 1 && page >= Math.ceil(totalHits / perPage)) {
      this.info();
      buttonLoadMore.classList.add('hidden');
    }
  }
}
