export class BookingModel {
    constructor() {
        // Catalogue des navires et horaires disponibles
        this.shipsCatalog = [
            {
                name: 'Avenir de la Méditerranée',
                company: 'Cie Corsica Express',
                basePrice: 42,
                dep: '07:30',
                arr: '13:15',
                duration: '5h 45m',
                type: 'Fauteuil Club Sévigné'
            },
            {
                name: 'Mega Express III',
                company: 'Corsica Ferries',
                basePrice: 48,
                dep: '12:00',
                arr: '18:30',
                duration: '6h 30m',
                type: 'Cabine Privée 4 Couchettes'
            },
            {
                name: 'Pascal Paoli',
                company: 'Corsica Linea',
                basePrice: 55,
                dep: '19:45',
                arr: '07:00 (+1j)',
                duration: '11h 15m (Nuit)',
                type: 'Cabine Suite Vue Mer'
            },
            {
                name: 'Stella Marine Horizon',
                company: 'Azur Ferries',
                basePrice: 38,
                dep: '21:15',
                arr: '06:30 (+1j)',
                duration: '9h 15m (Nuit)',
                type: 'Fauteuil Relax Premium'
            }
        ];

        // Grille tarifaire des véhicules
        this.vehicleCatalog = {
            'none': { price: 0, label: 'Aucun' },
            'citadine': { price: 45, label: 'Citadine (<4m)' },
            'berline': { price: 65, label: 'Berline/SUV (4-5m)' },
            'moto': { price: 25, label: 'Moto / Scooter' },
            'camping-car': { price: 110, label: 'Camping-car' }
        };

        // État courant de l'application
        this.searchParams = null;
        this.currentOffers = [];
        this.selectedOfferIndex = null;
    }

    /**
     * Valide les critères de recherche saisis par l'utilisateur
     */
    validateSearch(params) {
        if (!params.depart || !params.arrivee) {
            return { valid: false, message: "Veuillez choisir un port de départ et un port d'arrivée." };
        }

        if (params.depart === params.arrivee) {
            return { valid: false, message: "Le port de départ et le port d'arrivée doivent être différents." };
        }

        const totalPassengers = params.nbAdultes + params.nbJuniors + params.nbEnfants;
        if (totalPassengers < 1) {
            return { valid: false, message: "Veuillez sélectionner au moins un passager." };
        }

        if (!params.dateDepart) {
            return { valid: false, message: "Veuillez choisir une date de départ." };
        }

        return { valid: true };
    }

    /**
     * Calcule et génère la liste des traversées correspondant à la recherche
     */
    generateOffers(params) {
        this.searchParams = params;
        this.selectedOfferIndex = null;

        const vehicleInfo = this.vehicleCatalog[params.typeVehicule] || this.vehicleCatalog['none'];

        this.currentOffers = this.shipsCatalog.map((ship, idx) => {
            const adultTotal = params.nbAdultes * ship.basePrice;
            const juniorTotal = params.nbJuniors * (ship.basePrice * 0.8);
            const childTotal = params.nbEnfants * (ship.basePrice * 0.5);
            const totalPrice = Math.round(adultTotal + juniorTotal + childTotal + vehicleInfo.price);

            return {
                id: idx,
                shipName: ship.name,
                company: ship.company,
                depTime: ship.dep,
                arrTime: ship.arr,
                duration: ship.duration,
                installation: ship.type,
                price: totalPrice,
                depart: params.depart,
                arrivee: params.arrivee,
                date: params.dateDepart
            };
        });

        return this.currentOffers;
    }

    /**
     * Enregistre l'index de la traversée choisie
     */
    selectOffer(index) {
        this.selectedOfferIndex = index;
    }

    /**
     * Prépare l'objet récapitulatif pour la confirmation finale
     */
    createBookingSummary() {
        if (this.selectedOfferIndex === null || !this.currentOffers[this.selectedOfferIndex]) {
            return null;
        }

        const offer = this.currentOffers[this.selectedOfferIndex];
        const randomCode = Math.floor(1000 + Math.random() * 9000);

        // Formatage de la date en français
        const dateObj = new Date(this.searchParams.dateDepart);
        const dateFormatted = dateObj.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        // Formatage du texte des passagers et du véhicule
        let passList = [`${this.searchParams.nbAdultes} Ad.`];
        if (this.searchParams.nbJuniors > 0) passList.push(`${this.searchParams.nbJuniors} Jun.`);
        if (this.searchParams.nbEnfants > 0) passList.push(`${this.searchParams.nbEnfants} Enf.`);

        const vehicleInfo = this.vehicleCatalog[this.searchParams.typeVehicule] || this.vehicleCatalog['none'];

        return {
            reference: `#MAR-2026-${randomCode}`,
            shipName: offer.shipName,
            route: `${offer.depart} ➔ ${offer.arrivee}`,
            dateTime: `${dateFormatted} • ${offer.depTime}`,
            passengersAndVehicle: `${passList.join(', ')} | ${vehicleInfo.label}`,
            totalPrice: `${offer.price},00 €`
        };
    }
}