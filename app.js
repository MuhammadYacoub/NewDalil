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
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const paginatedData = data.slice(start, end);
  paginatedData.forEach((consultant) => {
    const div = document.createElement('div');
    div.classList.add('consultant');
    div.innerHTML = `
      <img src="images/${consultant.ConsultantID}.webp" alt="${consultant.Name}" loading="lazy" />
      <h5>المستشار</h5>
            <h3>${consultant.Name}</h3>

              <p>${consultant.CurrentRankID}</p>

      <div class="details" style="display: none;">
        <hr>
        <p><strong>الدرجة:</strong> ${consultant.CurrentRankID}</p>
        <p><strong>الفرع:</strong> ${consultant.BranchName}</p>
        <p><strong>القطاع:</strong> ${consultant.SectorName}</p>
        <p><strong>العنوان:</strong> ${consultant.Address}</p>
        <p><strong>الهاتف:</strong> ${consultant.PhoneNumber}</p>
        <p><strong>البريد الإلكتروني:</strong> ${consultant.Email}</p>
        <hr>
        <div class="container card-buttons"> 
            <button class="btn btn-primary" onclick="window.open('tel:${consultant.PhoneNumber}')" data-toggle="tooltip" title="اتصال">
                <i class="fas fa-phone"></i>
            </button>
            <button class="btn btn-success" onclick="window.open('https://wa.me/+200${consultant.PhoneNumber}')" data-toggle="tooltip" title="واتساب">
                <i class="fab fa-whatsapp"></i> 
            </button>
            <button class="btn btn-primary" onclick="saveAsContact('${consultant.Name}', '${consultant.PhoneNumber}', '${consultant.Email}', '${consultant.Address}')" data-toggle="tooltip" title="حفظ كجهة اتصال">
                <i class="fas fa-address-book"></i>   
            </button>
        </div>
      </div>
      
    `;
    container.appendChild(div);

    div.addEventListener('click', () => {
      const detailsDiv = div.querySelector('.details');
      const isVisible = detailsDiv.classList.contains('expanded');
      detailsDiv.classList.toggle('expanded', !isVisible);
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
    button.innerHTML = 'Load More <i class="fas fa-arrow-down"></i>';
    button.classList.add('load-more-btn');
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

// Function to create and download vCard
function saveAsContact(name, phone, email, address) {
  const vCardData = `
BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone}
EMAIL:${email}
ADR:${address}
END:VCARD
  `;
  const blob = new Blob([vCardData], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Initial call to display consultants
displayConsultants(data);
