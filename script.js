let imagesData = [];
let filteredTag = null;

const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("searchInput");
const filterButtonsContainer = document.getElementById("filterButtons");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

// Cargar las imagenes desde el archivo JSON

fetch("data.json")
    .then(response => response.json())
    .then(data => {
        imagesData = data;
        renderFilterButtons();
        renderGallery(imagesData);
    });

// Renderizar botones de dinamicamente

function renderFilterButtons() {
    const alltags = new Set(imagesData.flatMap(img => img.tags));


    filterButtonsContainer.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.textContent = "Todas";
    allBtn.classList.add("active");
    allBtn.addEventListener("click", () => {
        filteredTag = null;
        searchInput.value = "";
        setActiveButton(allBtn);
        renderGallery();
    });
    filterButtonsContainer.appendChild(allBtn);

    alltags.forEach(tag => {
        const btn = document.createElement("button");
        btn.textContent = tag;
        btn.addEventListener("click", ()=>{
            filteredTag = tag;
            searchInput.value = "";
            setActiveButton(btn);
            const filtered = imagesData.filter(img => img.tags.includes(tag));
            renderGallery(filtered);
        });
        filterButtonsContainer.appendChild(btn);
    });
}
// Resaltar boton activo
function setActiveButton(activeBtn) {
    document.querySelectorAll("#filterButtons button").forEach(btn => {
        btn.classList.remove("active");
    });
    activeBtn.classList.add("active");
}
// Renderizar la galeria
function renderGallery(images) {
    gallery.innerHTML = "";
    images.forEach(img => {
        const imgEL = document.createElement("img");
        imgEL.src = img.src;
        imgEL.alt = img.alt;
        imgEL.title = img.title;
        imgEL.addEventListener("click", () => showModal(img.src));
        gallery.appendChild(imgEL);
    });
}
// Modal
function showModal(src) {
    modalImage.src = src;
    modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

modal.addEventListener("click", (e)=> {
    if(e.target === modal){
        modal.classList.add("hidden");
    }
});
// Busqueda 
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = imagesData.filter(img => 
        img.title.toLowerCase().includes(query) ||
        img.tags.some(tag => tag.toLowerCase().includes(query))
    );
    document.querySelectorAll("#filterButtons button").forEach(btn => btn.classList.remove("active"));
    renderGallery(filtered);
})