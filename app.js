const reviewForm = document.getElementById('review-form');
const reviewList = document.getElementById('review-list');

let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

function renderReviews() {
  reviewList.innerHTML = '';
  reviews.forEach(r => {
    const div = document.createElement('div');
    div.style.background = '#3a3a4f';
    div.style.padding = '10px';
    div.style.borderRadius = '8px';
    div.style.marginBottom = '10px';
    div.innerHTML = `<strong>${r.name}</strong><p>${r.text}</p>`;
    reviewList.appendChild(div);
  });
}

reviewForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const text = document.getElementById('review').value.trim();
  if(!name || !text) return;
  reviews.push({name, text});
  localStorage.setItem('reviews', JSON.stringify(reviews));
  reviewForm.reset();
  renderReviews();
});

renderReviews();