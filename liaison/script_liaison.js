function rechercher() {
    const depart = document.getElementById("depart").value;
    const arrivee = document.getElementById("arrivee").value;

    // Vérifier le départ et l'arrivée
    if (depart === "" || arrivee === "") {
        alert("Veuillez sélectionner un départ et une arrivée.");
        return;
    }

    // Vérifier que les deux ports sont différents
    if (depart === arrivee) {
        alert("Le départ et l'arrivée doivent être différents.");
        return;
    }

    // Redirection simplifiée avec les backticks (`)
    window.location.href = `../tarifs/pages_tarif/index_tarif.html?depart=${encodeURIComponent(depart)}&arrivee=${encodeURIComponent(arrivee)}`;
}