import Notiflix from 'notiflix';
import axios from 'axios';

const searchBox = document.querySelector('input');
const submitButton = document.querySelector('button');
const loadButton = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const userKey = '33215953-674c55a945dec9bfe68981b61';

let page = 1;

submitButton.addEventListener('click', async event => {
  event.preventDefault();
  try {
    const photos = await getPhoto();
    if (photos[0].length > 0) {
      renderPhotos(photos[0]);
      loadButton.classList.remove('hidden');
      page += 1;
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error);
  }
});

loadButton.addEventListener('click', async event => {
  event.preventDefault();
  try {
    const photos = await getPhoto();
    if (photos[0].length > 0) {
      renderPhotos(photos[0]);
      Notiflix.Notify.success(`Hooray! We found ${photos[1]} images.`);
      page += 1;
    } else {
      loadButton.classList.add('hidden');
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  } catch (error) {
    console.log(error);
  }
});

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
      photo => `<div class="photo-card">
  <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
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
