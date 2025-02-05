// Load JSON data
fetch('data/consultants.json')
  .then((response) => response.json())
  .then((data) => initialize(data));

let allData = [];
let currentPage = 1;
const itemsPerPage = 50;

function initialize(data) {
  allData = data;
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
  filterSector.addEventListener('change', () => filterData(data, container, search, filterRank, filterBranch, filterSector));
}

function populateFilters(data, filterElement, key) {
  const uniqueValues = [...new Set(data.map(item => item[key]))];
  uniqueValues.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    filterElement.appendChild(option);
  });
}




function displayConsultants(data) {
  const container = document.getElementById('consultants-container');

  // Calculate the range of items for the current page
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const paginatedData = data.slice(start, end);
  paginatedData.forEach((consultant) => {
    const div = document.createElement('div');
    div.classList.add('consultant');
    div.innerHTML = `
      <img src="images/${consultant.ConsultantID}.webp" alt="${consultant.Name}" loading="lazy"  onerror="this.src='/images/clogo.png';">
      <h5>المستشار</h5>
      <h3>${consultant.Name}</h3>
      <p>${consultant.CurrentRankID}</p>
      <div class="details" style="display: none;">
        <hr>
        <p><strong>الدرجـة:</strong> ${consultant.CurrentRankID}</p>
        <p><strong>رقم الاقدمية:</strong> ${consultant.TimeRank}</p>
        <p><strong>الفـــرع:</strong> ${consultant.BranchName}</p>
        <p><strong>القطاع:</strong> ${consultant.SectorName}</p>
        <p><strong>العنوان:</strong> <a style="color:rgb(70, 71, 71); text-decoration: none" href="https://www.google.com/maps/search/?api=1&query=${consultant.Address}">${consultant.Address}</a></p>
        <p><strong>الهاتف:</strong> <a style="color: #28a745; text-decoration: none" href="tel:0${consultant.PhoneNumber}">0${consultant.PhoneNumber}</a></p>
        <hr>
        <div class="container card-buttons">
          <button class="btn btn-primary  btn-sm" onclick="window.open('tel:0${consultant.PhoneNumber}')" data-toggle="tooltip" title="اتصال">
            <i class="fas fa-phone"></i>
          </button>
          <button class="btn btn-success  btn-sm" onclick="window.open('https://wa.me/+200${consultant.PhoneNumber}')" data-toggle="tooltip" title="واتساب">
            <i class="fab fa-whatsapp"></i>
          </button>
          <button class="btn btn-primary btn-sm" onclick="saveAsContact('${consultant.Name}', '0${consultant.PhoneNumber}', '${consultant.Email}', '${consultant.Address}')" data-toggle="tooltip" title="حفظ كجهة اتصال">
            <i class="fas fa-address-book"></i>
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.open('mailto:${consultant.Email}')" data-toggle="tooltip" title="البريد الإلكتروني">
            <i class="fas fa-envelope"></i>
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${consultant.Address}')" data-toggle="tooltip" title="العنوان">
            <i class="fas fa-map-marker-alt"></i>
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

  if (currentPage * itemsPerPage < data.length) {
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

function filterData(data, container, search, filterRank, filterBranch, filterSector) {
  const searchTerm = search.value.toLowerCase();
  const rank = filterRank.value === 'اختر الدرجة' ? '' : filterRank.value;
  const branch = filterBranch.value === 'اختر الفرع' ? '' : filterBranch.value;
  const sector = filterSector.value === 'اختر القطاع' ? '' : filterSector.value;

  const filteredData = data.filter(consultant => {
    return (
      (consultant.Name.toLowerCase().includes(searchTerm) || consultant.BranchName.toLowerCase().includes(searchTerm)) &&
      (rank === '' || consultant.CurrentRankID === rank) &&
      (branch === '' || consultant.BranchName === branch) &&
      (sector === '' || consultant.SectorName === sector)
    );
  });

  container.innerHTML = ''; // Clear previous content
  currentPage = 1; // Reset to the first page
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
displayConsultants(allData);
