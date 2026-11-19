// DONNEES TARIFAIRES

        const data = {

        quiberon: {
            A: {
                title: "Tarifs passagers",
                description: "Choisissez votre profil de voyageur.",
                offers: [
                    {name:"Adulte",code:"A1",detail:"Tarif adulte",prices:[18,20,19]},
                    {name:"Junior",code:"A2",detail:"De 8 à 18 ans",prices:[11.10,13.10,12.10]},
                    {name:"Enfant",code:"A3",detail:"De 0 à 7 ans",prices:[5.60,7,6.40]}
                ]
            },
            B: {
                title: "Véhicules inférieurs à 2 m",
                description: "Choisissez votre véhicule selon sa longueur.",
                offers: [
                    {name:"Voiture",code:"B1",detail:"Longueur inférieure à 4 m",prices:[86,95,91]},
                    {name:"Voiture",code:"B2",detail:"Longueur inférieure à 5 m",prices:[129,142,136]}
                ]
            },
            C: {
                title: "Véhicules supérieurs à 2 m",
                description: "Choisissez le type de votre véhicule.",
                offers: [
                    {name:"Fourgon",code:"C1",detail:"Transport de marchandises",prices:[189,208,199]},
                    {name:"Camping-car",code:"C2",detail:"Véhicule de loisirs",prices:[205,226,216]},
                    {name:"Camion",code:"C3",detail:"Véhicule utilitaire",prices:[268,295,282]}
                ]
            }
        },

        vannes: {
            A: {
                title: "Tarifs passagers",
                description: "Choisissez votre profil de voyageur.",
                offers: [
                    {name:"Adulte",code:"A1",detail:"Tarif adulte",prices:[27.20,29.30,28.50]},
                    {name:"Junior",code:"A2",detail:"De 8 à 18 ans",prices:[17.30,18.60,18.10]},
                    {name:"Enfant",code:"A3",detail:"De 0 à 7 ans",prices:[9.80,10.60,10.20]}
                ]
            },
            B: {
                title: "Véhicules inférieurs à 2 m",
                description: "Choisissez votre véhicule selon sa longueur.",
                offers: [
                    {name:"Voiture",code:"B1",detail:"Longueur inférieure à 4 m",prices:[129,139,135]},
                    {name:"Voiture",code:"B2",detail:"Longueur inférieure à 5 m",prices:[194,209,203]}
                ]
            },
            C: {
                title: "Véhicules supérieurs à 2 m",
                description: "Choisissez le type de votre véhicule.",
                offers: [
                    {name:"Fourgon",code:"C1",detail:"Transport de marchandises",prices:[284,306,298]},
                    {name:"Camping-car",code:"C2",detail:"Véhicule de loisirs",prices:[308,332,323]},
                    {name:"Camion",code:"C3",detail:"Véhicule utilitaire",prices:[402,434,422]}
                ]
            }
        }

        };

        let currentRoute = "quiberon";
        let currentCategory = "A";
        let currentPeriod = 0;

        // AFFICHER LES TARIFS

        function render() {

            const category = data[currentRoute][currentCategory];

            document.getElementById("category-title").textContent = category.title;
            document.getElementById("category-description").textContent = category.description;

            const offersContainer = document.getElementById("offers");

            offersContainer.innerHTML = category.offers.map(offer => {

                const price = offer.prices[currentPeriod].toFixed(2);

                return `
                    <div class="offer">
                        <div class="offer-info">
                            <strong>${offer.name}</strong>
                            <span>${offer.code} · ${offer.detail}</span>
                        </div>

                        <div class="offer-price">
                            ${price} <small>€</small>
                        </div>
                    </div>
                `;

            }).join("");
        }

        // CHANGER DE LIAISON

        function selectRoute(route,button) {

            currentRoute = route;

            document.querySelectorAll(".liaison-btn").forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            render();
        }

        // CHANGER DE CATEGORIE

        function selectCategory(category,button) {

            currentCategory = category;

            document.querySelectorAll(".category-btn").forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            render();
        }

        // CHANGER DE PERIODE

        function selectPeriod(period,button) {

            currentPeriod = period;

            document.querySelectorAll(".period-btn").forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            render();
        }

        // INITIALISATION

        render();