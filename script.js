// URL de l'API
const apiUrl = "http://localhost:5678/api/works";
const apiwo = "http://localhost:5678/api/works/";
const apiCategoriesUrl = "http://localhost:5678/api/categories";
const token = localStorage.getItem("token");
let projects = [];

// Filtrer les projets par catégorie
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
          figure.dataset.id = project.id; // Ajouter data-id pour référence facile
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

// Récupérer les catégories et ajouter des boutons de filtre
fetch(apiCategoriesUrl)
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
    populateCategorySelect(categories); // Peupler le champ select dans le formulaire d'ajout
  })
  .catch((error) => {
    console.error("Erreur:", error);
  });

// Afficher tous les projets au chargement de la page
filterProjectsByCategory("all", null);

// Gérer l'affichage des boutons de connexion et de déconnexion
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

// Fonction de déconnexion
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

// Gérer le modal pour afficher les images
var modal = document.getElementById("myModal");
var btn = document.getElementById("openModalBtn");
var span = document.getElementsByClassName("close")[0];
var modalImagesContainer = document.getElementById("modalImages");

function displayImagesInModal(images) {
  modalImagesContainer.innerHTML = "";
  images.forEach((image) => {
    const imageDiv = document.createElement("div");
    imageDiv.dataset.id = image.id; // Ajouter data-id pour référence facile
    const imgElement = document.createElement("img");
    imgElement.src = image.imageUrl;
    imgElement.alt = image.title;
    imageDiv.appendChild(imgElement);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash", "delete-icon");
    deleteIcon.addEventListener("click", () => {
      fetch(`${apiwo}/${image.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            // Remove image from modal
            imageDiv.remove();
            // Remove image from gallery
            for (let i = 0; i < projects.length; i++) {
              if (projects[i].id == image.id) {
                projects.splice(i, 1);
                break;
              }
            }
            const galleryFigure = document.querySelector(
              `.gallery figure[data-id="${image.id}"]`
            );
            if (galleryFigure) {
              galleryFigure.remove();
            }
          } else {
            throw new Error("Erreur lors de la suppression de l'image");
          }
        })
        .catch((error) => {
          console.error("Erreur:", error);
          alert("Une erreur est survenue lors de la suppression de l'image.");
        });
    });
    imageDiv.appendChild(deleteIcon);

    modalImagesContainer.appendChild(imageDiv);
  });
}

btn.addEventListener("click", function () {
  modal.style.display = "block";
  displayImagesInModal(projects);
});

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Gérer le modal pour ajouter des photos
const openModal2Btn = document.getElementById("openModal2Btn");
const modal2 = document.getElementById("myModal2");
const backToModal1Icon = document.getElementById("backToModal1");

openModal2Btn.addEventListener("click", function () {
  modal2.style.display = "block";
  modal.style.display = "none";
});

backToModal1Icon.addEventListener("click", function () {
  modal2.style.display = "none";
  modal.style.display = "block";
});

// Peupler le champ select dans le formulaire d'ajout
function populateCategorySelect(categories) {
  const categorySelect = document.getElementById("cat");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}
const fileInput = document.getElementById("addfile");
// Gérer la soumission du formulaire d'ajout de projet
const addPhotoForm = document.getElementById("formmm");
const submitbtn = document.querySelector(".submit-btn");
fileInput.addEventListener("change", function (event) {
  const imagePreview = document.querySelector(".itt");
  let reader = new FileReader();
  reader.readAsDataURL(fileInput.files[0]);
  reader.onload = function (e) {
    document.querySelector(".image-label").style.display = "none";

    imagePreview.style.display = "inline";
    imagePreview.src = e.target.result;
  };
  if (fieldsAreOk()) {
    submitbtn.disabled = false;
  } else submitbtn.disabled = true;
});
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("cat");
titleInput.addEventListener("change",function(){
    if (fieldsAreOk()) {
        submitbtn.disabled = false;
      } else submitbtn.disabled = true;
})
categorySelect.addEventListener("change",function(){
    if (fieldsAreOk()) {
        submitbtn.disabled = false;
        console.log("ok")
      } else submitbtn.disabled = true;
})
function fieldsAreOk() {
  if (
    fileInput.files.length === 0 ||
    titleInput.value === "" ||
    categorySelect.value === ""
  ) {
    return false;
  }
  return true;
}
addPhotoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData();

  if (
    fileInput.files.length === 0 ||
    titleInput.value === "" ||
    categorySelect.value === ""
  ) {
    alert("Veuillez remplir tous les champs du formulaire.");
    return;
  }

  formData.append("image", fileInput.files[0]);
  formData.append("title", titleInput.value);
  formData.append("category", categorySelect.value);

  console.log("Form Data:", formData); // Message de débogage

  fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      console.log("Response status:", response.status); // Message de débogage
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((error) => {
          console.error("Erreur:", error);
          alert("Erreur lors de l'ajout du projet.");
          throw new Error("Erreur lors de l'ajout du projet.");
        });
      }
    })
    .then((newProject) => {
      projects.push(newProject);
      const galleryDiv = document.querySelector(".gallery");

      const figure = document.createElement("figure");
      figure.dataset.id = newProject.id;
      const image = document.createElement("img");
      image.src = newProject.imageUrl;
      image.alt = newProject.title;
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = newProject.title;
      figure.appendChild(image);
      figure.appendChild(figcaption);
      galleryDiv.appendChild(figure);
    displayImagesInModal(projects)
      addPhotoForm.reset();
      modal2.style.display = "none";
      modal.style.display = "block";
    })
    .catch((error) => {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de l'ajout du projet.");
    });
});
