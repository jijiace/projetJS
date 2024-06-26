const apiUrl = "http://localhost:5678/api/works";
const apiwo = "http://localhost:5678/api/works/";
const token = localStorage.getItem("token");
let projects = [];

function filterProjectsByCategory(categoryId, clickedButton) {
    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données");
            }
            return response.json();
        })
        .then((projectsapi) => {
            const galleryDiv = document.querySelector(".gallery");
            galleryDiv.innerHTML = "";
            projects = projectsapi;
            projects.forEach((project) => {
                if (project.category.id === categoryId || categoryId === "all") {
                    const figure = document.createElement("figure");
                    figure.dataset.id = project.id; // Add data-id for easy reference
                    const image = document.createElement("img");
                    image.src = project.imageUrl;
                    image.alt = project.title;
                    const figcaption = document.createElement("figcaption");
                    figcaption.textContent = project.title;
                    figure.appendChild(image);
                    figure.appendChild(figcaption);
                    galleryDiv.appendChild(figure);
                }
            });
            if (!token) {
                const buttons = document.querySelectorAll(".button button");
                buttons.forEach((button) => {
                    button.classList.remove("active");
                });
                if (clickedButton) {
                    clickedButton.classList.add("active");
                }
            }
        })
        .catch((error) => {
            console.error("Erreur:", error);
        });
}

fetch("http://localhost:5678/api/categories")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données");
        }
        return response.json();
    })
    .then((categories) => {
        if (!token) {
            const buttonDiv = document.querySelector(".button");
            categories.forEach((category) => {
                const button = document.createElement("button");
                button.textContent = category.name;
                button.addEventListener("click", () => {
                    filterProjectsByCategory(category.id, button);
                });
                buttonDiv.appendChild(button);
            });
        }
    })
    .catch((error) => {
        console.error("Erreur:", error);
    });

filterProjectsByCategory("all", null);

const loginButton = document.querySelector('li a[href="login.html"]');
const logoutButton = document.querySelector('li a[href="index.html"]');
const filters = document.querySelectorAll(".filter");
const buttonSection = document.querySelector(".button");

document.addEventListener("DOMContentLoaded", function () {
    if (token) {
        loginButton.parentNode.style.display = "none";
        logoutButton.parentNode.style.display = "block";
        logoutButton.addEventListener("click", function (event) {
            event.preventDefault();
            logout();
        });

        filters.forEach((filter) => {
            filter.style.display = "none";
        });

        buttonSection.style.display = "none";
        buttonSection.remove();
    } else {
        loginButton.parentNode.style.display = "block";
        logoutButton.parentNode.style.display = "none";

        filters.forEach((filter) => {
            filter.style.display = "block";
        });
    }
});

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
    const loginButton = document.querySelector('li a[href="login.html"]');
    const logoutButton = document.querySelector('li a[href="index.html"]');
    loginButton.parentNode.style.display = "block";
    logoutButton.parentNode.style.display = "none";
    const buttonSection = document.querySelector(".button");
    if (buttonSection) {
        buttonSection.style.display = "block";
    }
}

var modal = document.getElementById("myModal");
var btn = document.getElementById("openModalBtn");
var span = document.getElementsByClassName("close")[0];
var modalImagesContainer = document.getElementById("modalImages");

function displayImagesInModal(images) {
    modalImagesContainer.innerHTML = '';
    images.forEach(image => {
        const imageDiv = document.createElement('div');
        imageDiv.dataset.id = image.id; // Add data-id for easy reference
        const imgElement = document.createElement('img');
        imgElement.src = image.imageUrl;
        imgElement.alt = image.title;
        imageDiv.appendChild(imgElement);
        
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add("fa-solid", "fa-trash", "delete-icon");
        deleteIcon.addEventListener('click', () => {
            fetch(`${apiwo}/${image.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    // Remove image from modal
                    imageDiv.remove();
                    // Remove image from gallery
                   for(let i=0;i<projects.length;i++){
                    if (projects[i].id ==image.id) {
                       projects.splice(i,1) 
                       break
                    }

                   }
                   

                    const galleryFigure = document.querySelector(`.gallery figure[data-id="${image.id}"]`);
                    if (galleryFigure) {
                        galleryFigure.remove();
                    }
                } else {
                    throw new Error('Erreur lors de la suppression de l\'image');
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Une erreur est survenue lors de la suppression de l\'image.');
            });
        });
        imageDiv.appendChild(deleteIcon);

        modalImagesContainer.appendChild(imageDiv);
    });
}

btn.addEventListener("click", function() {
    modal.style.display = "block";
    displayImagesInModal(projects);
});

span.onclick = function() {
    modal.style.display = "none";
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

const openModal2Btn = document.getElementById('openModal2Btn');
const modal2 = document.getElementById('myModal2');

openModal2Btn.addEventListener('click', function() {
    modal2.style.display = "block";
    modal.style.display = "none";
});

const backToModal1Icon = document.getElementById('backToModal1');
backToModal1Icon.addEventListener('click', function() {
    modal2.style.display = "none";
    modal.style.display = "block";
});
