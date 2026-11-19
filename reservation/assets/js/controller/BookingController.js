export class BookingController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    /**
     * Initialise la Vue et branche tous les écouteurs d'événements
     */
    init() {
        this.view.init();
        this.view.bindSearchSubmit(() => this.handleSearch());
        this.view.bindQuickRoutes((depart, arrivee) => this.handleQuickRoute(depart, arrivee));
        this.view.bindConfirmBooking(() => this.handleConfirmBooking());
        this.view.bindModalControls();
    }

    /**
     * Traite la soumission du formulaire de recherche
     */
    handleSearch() {
        const formData = this.view.getFormData();
        const validation = this.model.validateSearch(formData);

        if (!validation.valid) {
            this.view.showError(validation.message);
            return;
        }

        this.view.hideError();
        const offers = this.model.generateOffers(formData);

        this.view.renderOffers(
            offers,
            this.model.selectedOfferIndex,
            (index) => this.handleSelectOffer(index)
        );
    }

    /**
     * Traite le clic sur un raccourci d'itinéraire populaire
     */
    handleQuickRoute(depart, arrivee) {
        this.view.fillQuickRoute(depart, arrivee);
        this.handleSearch();
    }

    /**
     * Traite la sélection d'une traversée par l'utilisateur
     */
    handleSelectOffer(index) {
        this.model.selectOffer(index);
        this.view.hideError();

        this.view.renderOffers(
            this.model.currentOffers,
            this.model.selectedOfferIndex,
            (idx) => this.handleSelectOffer(idx)
        );
    }

    /**
     * Traite le clic sur "Valider la réservation"
     */
    handleConfirmBooking() {
        const summary = this.model.createBookingSummary();

        if (!summary) {
            this.view.showError("Veuillez d'abord sélectionner une traversée dans la liste ci-dessus.");
            return;
        }

        this.view.hideError();
        this.view.openConfirmationModal(summary);
    }
}