// Load JSON data
fetch('data/consultants.json')
  .then((response) => response.json())
  .then((data) => initialize(data));

function initialize(data) {
  const container = document.getElementById('consultants-container');
  const search = document.getElementById('search');
  const filterRank = document.getElementById('filter-rank');
  const filterBranch = document.getElementById('filter-branch');
  const filterSector = document.getElementById('filter-sector');

  // Populate dropdown filters
  populateFilters(data, filterRank, 'CurrentRankID');
  populateFilters(data, filterBranch, 'BranchName');
  populateFilters(data, filterSector, 'SectorName');

  // Display initial data
  displayConsultants(data);

  // Event Listeners
  search.addEventListener('input', () => filterData(data, container, search, filterRank, filterBranch, filterSector));
  filterRank.addEventListener('change', () => filterData(data, container, search, filterRank, filterBranch, filterSector));
  filterBranch.addEventListener('change', () => filterData(data, container, search, filterRank, filterBranch, filterSector));
}

function populateFilters(data, filterElement, key) {
  const uniqueValues = [...new Set(data.map((item) => item[key]))];
  uniqueValues.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    filterElement.appendChild(option);
  });
}

let currentPage = 1;
const itemsPerPage = 50;

function displayConsultants(data) {
  const container = document.getElementById('consultants-container');
  container.innerHTML = ''; // Clear previous content

  // Calculate the range of items for the current page
  const start = 0;
  const end = currentPage * itemsPerPage;

  const paginatedData = data.slice(start, end);
  paginatedData.forEach((consultant) => {
    const div = document.createElement('div');
    div.classList.add('consultant');
    div.innerHTML = `
      <img src="images/${consultant.ConsultantID}.webp" alt="${consultant.Name}" loading="lazy" />
      <h3>${consultant.Name}</h3>
      <div class="details" style="display: none;">
        <hr>
        <p><strong>الدرجة:</strong> ${consultant.CurrentRankID}</p>
        <p><strong>الفرع:</strong> ${consultant.BranchName}</p>
        <p><strong>القطاع:</strong> ${consultant.SectorName}</p>
        <p><strong>العنوان:</strong> ${consultant.Address}</p>
        <p><strong>الهاتف:</strong> ${consultant.PhoneNumber}</p>
        <p><strong>البريد الإلكتروني:</strong> ${consultant.Email}</p>
      </div>
      <button class="btn btn-success" onclick="window.open('https://wa.me/+200${consultant.PhoneNumber}')">
        <i class="fab fa-whatsapp"></i> واتساب
      </button>
    `;
    container.appendChild(div);

    div.addEventListener('click', () => {
      const detailsDiv = div.querySelector('.details');
      const isVisible = detailsDiv.style.display === 'block';
      detailsDiv.style.display = isVisible ? 'none' : 'block';
    });
  });

  renderLoadMoreButton(data);
}

function renderLoadMoreButton(data) {
  const loadMoreContainer = document.getElementById('load-more-container');
  loadMoreContainer.innerHTML = ''; // Clear previous button

  const totalPages = Math.ceil(data.length / itemsPerPage);

  if (currentPage < totalPages) {
    const button = document.createElement('button');
    button.textContent = 'Load More';
    button.classList.add('btn', 'btn-primary', 'mt-4');
    button.addEventListener('click', () => {
      currentPage++;
      displayConsultants(data);
    });
    loadMoreContainer.appendChild(button);
  }
}

// Add a pagination container in HTML
document.body.insertAdjacentHTML('beforeend', '<div id="pagination" class="pagination"></div>');


function filterData(data, container, search, filterRank, filterBranch) {
  const searchTerm = search.value.toLowerCase();
  const selectedRank = filterRank.value;
  const selectedBranch = filterBranch.value;

  const filteredData = data.filter((item) => {
    const matchesSearch = item.Name.toLowerCase().includes(searchTerm) || item.BranchName.toLowerCase().includes(searchTerm);
    const matchesRank = !selectedRank || item.CurrentRankID === selectedRank;
    const matchesBranch = !selectedBranch || item.BranchName === selectedBranch;
    return matchesSearch && matchesRank && matchesBranch;
  });

  displayConsultants(filteredData);
}

// Initial call to display consultants
displayConsultants(data);
