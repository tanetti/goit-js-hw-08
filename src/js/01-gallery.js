import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// Add imports above this line
import { galleryItems } from './gallery-items';
// Change code below this line

const galleryContainerRef = document.querySelector('div.gallery');

const createGalleryMarkup = galleryData =>
  galleryData
    .map(
      ({ preview, original, description }) =>
        `<div class="gallery__item">
            <a class="gallery__link" href="${original}">
                <img class="gallery__image" src="${preview}" alt="${description}" />
            </a>
        </div>`
    )
    .join('');

galleryContainerRef.innerHTML = createGalleryMarkup(galleryItems);

new SimpleLightbox('div.gallery a', {
  overlayOpacity: 0.85,
  captionsData: 'alt',
  captionDelay: 250,
  disableRightClick: true,
  alertError: false,
  maxZoom: 3,
});
