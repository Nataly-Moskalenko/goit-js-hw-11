import Notiflix from 'notiflix/build/notiflix-notify-aio';

const galleryContainer = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

export default function notiflixService(totalHits, page = 1, perPage = 40) {
  if (totalHits === 0) {
    Notiflix.Notify.failure(
      "Sorry, there are no images matching your search query. Please try again.'"
    );
    galleryContainer.innerHTML = '';
    buttonLoadMore.classList.add('hidden');
  } else {
    if (totalHits <= perPage) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      buttonLoadMore.classList.add('hidden');
    } else if (page === 1 && totalHits > perPage) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      buttonLoadMore.classList.remove('hidden');
    } else if (page > 1 && page >= Math.ceil(totalHits / perPage)) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      buttonLoadMore.classList.add('hidden');
    }
  }
}
