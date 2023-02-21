export default function galleryMarkup(imgs) {
  return imgs
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
}
