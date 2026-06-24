function addEventListeners() {
  const button = document.querySelector('#fetchButton');
  const input = document.querySelector('#queryInput');
  const results = document.querySelector('#results');

  if (!button || !input || !results) {
    console.warn('Required DOM elements not found.');
    return;
  }

  button.addEventListener('click', async (event) => {
    event.preventDefault();
    const query = input.value.trim();

    if (!query) {
      results.textContent = 'Please enter a search query.';
      return;
    }

    results.textContent = 'Loading...';

    try {
      const data = await fetchApiData(query);
      renderResults(data, results);
    } catch (error) {
      results.textContent = `Error: ${error.message}`;
    }
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      button.click();
    }
  });
}

async function fetchApiData(query) {
  const endpoint = `https://api.example.com/search?q=${encodeURIComponent(query)}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
  }

  const payload = await response.json();
  return payload;
}

function renderResults(data, resultsContainer) {
  if (!data || !Array.isArray(data.items) || data.items.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  data.items.slice(0, 10).forEach((item) => {
    const card = document.createElement('article');
    card.className = 'result-card';
    card.innerHTML = `
      <h3>${escapeHtml(item.title || 'Untitled')}</h3>
      <p>${escapeHtml(item.description || 'No description available.')}</p>
      <small>${escapeHtml(item.source || 'Unknown source')}</small>
    `;
    fragment.appendChild(card);
  });

  resultsContainer.innerHTML = '';
  resultsContainer.appendChild(fragment);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', addEventListeners);
}
