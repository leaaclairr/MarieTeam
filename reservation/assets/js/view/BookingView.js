export class BookingView {
    constructor() {
        // Références aux éléments du formulaire
        this.searchForm = document.getElementById('search-form');
        this.departSelect = document.getElementById('depart-port');
        this.arriveeSelect = document.getElementById('arrivee-port');
        this.adultesInput = document.getElementById('nb-adultes');
        this.juniorsInput = document.getElementById('nb-juniors');
        this.enfantsInput = document.getElementById('nb-enfants');
        this.vehiculeSelect = document.getElementById('type-vehicule');
        this.dateInput = document.getElementById('date-depart');

        // Références au panneau de résultats
        this.placeholderState = document.getElementById('placeholder-state');
        this.offersList = document.getElementById('offers-list');
        this.errorAlert = document.getElementById('error-alert');
        this.errorMessage = document.getElementById('error-message');
        this.confirmBtn = document.getElementById('btn-confirm-booking');
        this.quickRouteBtns = document.querySelectorAll('.quick-route-btn');

        // Références à la fenêtre modale
        this.modal = document.getElementById('booking-modal');
        this.modalCard = document.getElementById('modal-card');
        this.closeModalBtns = document.querySelectorAll('[data-close-modal]');
        this.printTicketBtn = document.getElementById('btn-print-ticket');
    }

    /**
     * Initialise la date par défaut (demain) et lance l'animation du fond océan
     */
    init() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.dateInput.value = tomorrow.toISOString().split('T')[0];

        this.initCanvasAnimation();
    }

    /**
     * Récupère les valeurs saisies dans le formulaire
     */
    getFormData() {
        return {
            depart: this.departSelect.value,
            arrivee: this.arriveeSelect.value,
            nbAdultes: parseInt(this.adultesInput.value, 10) || 0,
            nbJuniors: parseInt(this.juniorsInput.value, 10) || 0,
            nbEnfants: parseInt(this.enfantsInput.value, 10) || 0,
            typeVehicule: this.vehiculeSelect.value,
            dateDepart: this.dateInput.value
        };
    }

    /**
     * Remplit automatiquement les ports lors d'un clic sur un trajet suggéré
     */
    fillQuickRoute(depart, arrivee) {
        this.departSelect.value = depart;
        this.arriveeSelect.value = arrivee;
    }

    /**
     * Affiche ou masque l'alerte d'erreur
     */
    showError(message) {
        this.errorMessage.innerText = message;
        this.errorAlert.classList.remove('hidden');
    }

    hideError() {
        this.errorAlert.classList.add('hidden');
    }

    /**
     * Génère et affiche les cartes de traversées dans le panneau de droite
     */
    renderOffers(offers, selectedIndex, onSelectOffer) {
        this.offersList.innerHTML = '';

        offers.forEach((offer, idx) => {
            const isSelected = selectedIndex === idx;
            const card = document.createElement('div');
            card.className = `offer-card p-4 cursor-pointer relative ${isSelected ? 'selected' : ''}`;
            card.addEventListener('click', () => onSelectOffer(idx));

            card.innerHTML = `
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                    <div class="flex items-center space-x-2">
                        <span class="w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-sky-400 animate-ping' : 'bg-ocean-400'}"></span>
                        <h4 class="font-bold text-white text-base">${offer.shipName}</h4>
                        <span class="text-[11px] bg-ocean-800 text-ocean-300 px-2 py-0.5 rounded border border-ocean-600/40">${offer.company}</span>
                    </div>
                    <div class="text-right">
                        <span class="text-xl font-extrabold text-sky-300">${offer.price} €</span>
                        <span class="text-[10px] block text-ocean-200/70">TTC tout inclus</span>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-2 items-center py-2 border-y border-ocean-700/50 text-center my-2">
                    <div>
                        <span class="text-lg font-bold text-white block">${offer.depTime}</span>
                        <span class="text-xs text-ocean-200/70 block">${offer.depart}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-[11px] text-sky-300 font-medium">${offer.duration}</span>
                        <div class="w-full flex items-center justify-center my-1">
                            <div class="h-[1px] bg-ocean-500 w-full"></div>
                            <svg class="w-4 h-4 text-sky-400 mx-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                            </svg>
                            <div class="h-[1px] bg-ocean-500 w-full"></div>
                        </div>
                        <span class="text-[10px] text-emerald-400 font-semibold">Direct</span>
                    </div>
                    <div>
                        <span class="text-lg font-bold text-white block">${offer.arrTime}</span>
                        <span class="text-xs text-ocean-200/70 block">${offer.arrivee}</span>
                    </div>
                </div>

                <div class="flex items-center justify-between text-xs text-ocean-200/80 pt-1">
                    <span class="flex items-center space-x-1">
                        <svg class="w-3.5 h-3.5 text-ocean-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>${offer.installation}</span>
                    </span>
                    ${isSelected
                        ? '<span class="text-sky-300 font-bold bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-400/40">Sélectionné ✓</span>'
                        : '<span class="text-ocean-300">Cliquer pour choisir</span>'
                    }
                </div>
            `;

            this.offersList.appendChild(card);
        });

        this.placeholderState.classList.add('hidden');
        this.offersList.classList.remove('hidden');
        this.offersList.classList.add('animate-fade-in');
    }

    /**
     * Remplit et affiche la fenêtre modale de confirmation
     */
    openConfirmationModal(summary) {
        document.getElementById('modal-ref-num').innerText = summary.reference;
        document.getElementById('modal-ship').innerText = summary.shipName;
        document.getElementById('modal-route').innerText = summary.route;
        document.getElementById('modal-datetime').innerText = summary.dateTime;
        document.getElementById('modal-passengers').innerText = summary.passengersAndVehicle;
        document.getElementById('modal-total-price').innerText = summary.totalPrice;

        this.modal.classList.remove('opacity-0', 'pointer-events-none');
        this.modalCard.classList.remove('scale-95');
        this.modalCard.classList.add('scale-100');
    }

    /**
     * Ferme la fenêtre modale
     */
    closeConfirmationModal() {
        this.modal.classList.add('opacity-0', 'pointer-events-none');
        this.modalCard.classList.remove('scale-100');
        this.modalCard.classList.add('scale-95');
    }

    /**
     * Méthodes de liaison des événements DOM vers le Contrôleur
     */
    bindSearchSubmit(handler) {
        this.searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            handler();
        });
    }

    bindQuickRoutes(handler) {
        this.quickRouteBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const { depart, arrivee } = btn.dataset;
                handler(depart, arrivee);
            });
        });
    }

    bindConfirmBooking(handler) {
        this.confirmBtn.addEventListener('click', handler);
    }

    bindModalControls() {
        this.closeModalBtns.forEach((btn) => {
            btn.addEventListener('click', () => this.closeConfirmationModal());
        });

        this.printTicketBtn.addEventListener('click', () => window.print());
    }

    /**
     * Animation des vagues fluides en arrière-plan (Canvas 2D)
     */
    initCanvasAnimation() {
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        let step = 0;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Dégradé bleu profond de l'océan
            const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
            bgGradient.addColorStop(0, '#020c1b');
            bgGradient.addColorStop(0.5, '#041730');
            bgGradient.addColorStop(1, '#051c3d');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            // Couche de vague n°1
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(0, height * 0.6);
            for (let x = 0; x <= width; x += 20) {
                const y = Math.sin(x * 0.003 + step) * 35 + Math.cos(x * 0.002 + step * 0.8) * 20 + height * 0.65;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            const waveGrad1 = ctx.createLinearGradient(0, height * 0.5, width, height);
            waveGrad1.addColorStop(0, 'rgba(7, 53, 97, 0.4)');
            waveGrad1.addColorStop(1, 'rgba(11, 70, 125, 0.2)');
            ctx.fillStyle = waveGrad1;
            ctx.fill();
            ctx.restore();

            // Couche de vague n°2
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(0, height * 0.7);
            for (let x = 0; x <= width; x += 15) {
                const y = Math.cos(x * 0.004 - step * 1.2) * 45 + Math.sin(x * 0.0015 + step) * 25 + height * 0.75;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            const waveGrad2 = ctx.createLinearGradient(0, height * 0.6, 0, height);
            waveGrad2.addColorStop(0, 'rgba(14, 91, 158, 0.35)');
            waveGrad2.addColorStop(1, 'rgba(2, 12, 27, 0.9)');
            ctx.fillStyle = waveGrad2;
            ctx.fill();
            ctx.restore();

            // Crête lumineuse brillante sur la vague
            ctx.save();
            ctx.beginPath();
            for (let x = 0; x <= width; x += 10) {
                const y = Math.sin(x * 0.005 + step * 1.5) * 30 + Math.cos(x * 0.003 - step) * 15 + height * 0.52;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 12;
            ctx.stroke();
            ctx.restore();

            step += 0.008;
            requestAnimationFrame(animate);
        };

        animate();
    }
}