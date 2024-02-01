
const URL = 'https://fakestoreapi.com/products';

let app = {
    data: null,
    sortDirection: null,
    search: '',

    loadSettings() {
        let savedSearch = localStorage.getItem('search');
        let savedSortDirection = localStorage.getItem('sortDirection');

        if (savedSearch) {
            this.search = savedSearch;
            document.querySelector('#search').value = savedSearch; 
        }

        if (savedSortDirection) {
            this.sortDirection = savedSortDirection;
            document.querySelector(`#sort-${savedSortDirection}`).checked = true;
        }
    },

    saveSettings() {
        localStorage.setItem('search', this.search);
        localStorage.setItem('sortDirection', this.sortDirection);
    },

    doSearchAndSort(s, direction) {
        this.search = s.toLowerCase();
        this.sortDirection = direction;
        this.saveSettings();
        this.render();
    },

    async loadData() {
        let result = await fetch(URL);
        this.data = await result.json();
        this.render();
    },

    render() {
        let searchResults = this.data.map((item, index) => {
            item.originalIndex = index;
            return item;
        }).filter(item =>
            item.title.toLowerCase().includes(this.search) ||
            item.description.toLowerCase().includes(this.search)
        );

        if (this.sortDirection == 'up') {
            searchResults.sort((a, b) => a.price - b.price);
        } else if (this.sortDirection == 'down') {
            searchResults.sort((a, b) => b.price - a.price);
        } else {
            searchResults.sort((a, b) => a.originalIndex - b.originalIndex);
        }

        let main = document.querySelector('main');
        main.innerHTML = searchResults.map(item => `
            <div class="p-2">
                <div style="height: 100%" class="card">
                    <img style="height: 100%; width: 100%; background-size: cover;" src="${item.image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.description}</p>
                        <p class="card-price">${item.price}$</p>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

app.loadData();
app.loadSettings();

let searchInput = document.querySelector('#search');
searchInput.addEventListener('input', () => app.doSearchAndSort(searchInput.value, app.sortDirection));

let sortUpInput = document.querySelector('#sort-up');
sortUpInput.addEventListener('click', () => app.doSearchAndSort(app.search, 'up'));

let sortDownInput = document.querySelector('#sort-down');
sortDownInput.addEventListener('click', () => app.doSearchAndSort(app.search, 'down'));
