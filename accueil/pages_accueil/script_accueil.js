let estEnModeInscription = false;

    function basculerMode(event) {
      event.preventDefault();
      estEnModeInscription = !estEnModeInscription;
      const titre = document.getElementById("modalTitre");
      const champNom = document.getElementById("champNom");
      const btnAction = document.getElementById("btnAction");
      const texteSwitch = document.getElementById("texteSwitch");
      const lienSwitch = document.getElementById("lienSwitch");

      if (estEnModeInscription) {
        titre.textContent = "Créer un compte";
        champNom.style.display = "flex";
        btnAction.textContent = "S'inscrire";
        texteSwitch.textContent = "Déjà un compte ?";
        lienSwitch.textContent = "Se connecter";
      } else {
        titre.textContent = "Connexion";
        champNom.style.display = "none";
        btnAction.textContent = "Se connecter";
        texteSwitch.textContent = "Pas encore de compte ?";
        lienSwitch.textContent = "Créer un compte";
      }
    }

    function fermerModal() {
      document.getElementById("modalAuth").style.display = "none";
    }

    function validerAuth() {
      const email = document.getElementById("email").value;
      if (!email) {
        alert("Veuillez entrer un email.");
        return;
      }
      if (estEnModeInscription) {
        alert("Compte créé avec succès ! Bienvenue.");
      } else {
        alert("Connexion réussie !");
      }
      fermerModal();
    }