/*
Tive que adicionar uma função callback ao adicionar um elemento, pois ao fazer a validação
eu tenho que esperar a seção que contem o formulario de envio carregar para acessar os elementos.
*/
var loadComponent = function (componentPath, elementId, callback) {
    fetch(componentPath)
        .then(function (response) { return response.text(); })
        .then(function (html) {
        var element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
            if (callback)
                callback();
        }
    })
        .catch(function (err) {
        console.warn("Error loading component: ", err);
    });
};
// Função de inicialização da validação do formulário.
var initializeFormValidation = function () {
    var formEmail = document.getElementById("formEmail");
    var inputEmail = document.getElementById("inputEmail");
    if (!formEmail || !inputEmail) {
        console.warn("Email form or input not found!");
        return;
    }
    var message = document.createElement("p");
    message.style.marginTop = "10px";
    message.style.opacity = "0";
    message.style.transition = "opacity 0.5s ease-in-out";
    formEmail.appendChild(message);
    function isValidEmail(email) {
        // Regex stackoverflow - 1 validação - pelo menos 1 caractere e sem espaço ou @.
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Função test usada para testar se uma expressão regular é contida em uma string.
        return emailRegex.test(email);
    }
    formEmail.addEventListener("submit", function (event) {
        event.preventDefault();
        var email = inputEmail.value.trim();
        if (isValidEmail(email)) {
            message.textContent = "✔ Valid email! You have successfully subscribed.";
            message.style.color = "green";
        }
        else {
            message.textContent =
                "✖ Invalid email. Please enter a correct email address.";
            message.style.color = "red";
        }
        message.style.opacity = "1";
        setTimeout(function () {
            message.style.opacity = "0";
            setTimeout(function () {
                message.textContent = "";
            }, 100);
        }, 3000);
    });
};
// Carrousel
var initializeReviewCarousel = function () {
    var carouselContainer = document.getElementById("carousel-container");
    var prevButton = document.getElementById("previous");
    var nextButton = document.getElementById("next");
    if (!carouselContainer || !prevButton || !nextButton) {
        console.warn("Carrossel não encontrado!");
        return;
    }
    var moveNext = function () {
        var firstReview = carouselContainer.firstElementChild;
        if (firstReview) {
            firstReview.classList.add("moving-next"); // Aplica a animação
            setTimeout(function () {
                carouselContainer.appendChild(firstReview); // Move o elemento no DOM
                firstReview.classList.remove("moving-next"); // Remove a classe após a transição
                updateClasses();
            }, 500); // Tempo da animação em ms (deve ser igual ao CSS)
        }
    };
    var movePrevious = function () {
        var lastReview = carouselContainer.lastElementChild;
        if (lastReview) {
            lastReview.classList.add("moving-prev"); // Aplica a animação
            setTimeout(function () {
                carouselContainer.insertBefore(lastReview, carouselContainer.firstElementChild);
                lastReview.classList.remove("moving-prev"); // Remove a classe após a transição
                updateClasses();
            }, 500);
        }
    };
    var updateClasses = function () {
        var reviews = [];
        for (var i = 0; i < carouselContainer.children.length; i++) {
            reviews.push(carouselContainer.children[i]);
        }
        reviews.forEach(function (review, index) {
            review.className = "review review-".concat(index + 1);
        });
    };
    nextButton.addEventListener("click", moveNext);
    prevButton.addEventListener("click", movePrevious);
    updateClasses();
};
// Carrega a seção de reviews e inicializa o carrossel após o carregamento
window.onload = function () {
    loadComponent("./components/header.html", "header");
    loadComponent("./components/presentation.html", "presentation");
    loadComponent("./components/new_arrivals.html", "new-arrivals");
    loadComponent("./components/top_selling.html", "top-selling");
    loadComponent("./components/reviews.html", "reviews", initializeReviewCarousel);
    loadComponent("./components/browse.html", "browse");
    loadComponent("./components/footer.html", "footer", initializeFormValidation);
};
