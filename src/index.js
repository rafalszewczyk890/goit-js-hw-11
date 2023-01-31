import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchBox = document.querySelector('input');
const submitButton = document.querySelector('button');
const loadButton = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const userKey = '33215953-674c55a945dec9bfe68981b61';
let page = 1;
let lightbox;

function scrollCards() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  lightbox.refresh();
}

async function getPhoto() {
  const searchedTerm = searchBox.value;
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${userKey}&q=${searchedTerm}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    return [response.data.hits, response.data.totalHits];
  } catch (error) {
    console.error(error);
  }
}

function renderPhotos(photos) {
  let markup = photos
    .map(
      photo => `<div class="photo-card fade-in-image">
  <a href="${photo.largeImageURL}"> <img class="thumbnail" src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" /> </a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${photo.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${photo.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${photo.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${photo.downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

async function onSubmit(event) {
  event.preventDefault();
  page = 1;
  try {
    const photos = await getPhoto();
    if (photos[0].length > 0) {
      gallery.innerHTML = ' ';
      renderPhotos(photos[0]);
      loadButton.classList.remove('hidden');
      page += 1;
      Notiflix.Notify.success(`Hooray! We found ${photos[1]} images.`);
      lightbox = new SimpleLightbox('.gallery .photo-card a', {
        captionsData: 'alt',
        captionDelay: 250,
      });
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoad() {
  try {
    const photos = await getPhoto();
    if (photos[0].length > 0) {
      renderPhotos(photos[0]);
      scrollCards();
      page += 1;
    }
    if (photos[0].length < 40) {
      loadButton.classList.add('hidden');
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  } catch (error) {
    console.log(error);
  }
}

submitButton.addEventListener('click', onSubmit);

loadButton.addEventListener('click', onLoad);
