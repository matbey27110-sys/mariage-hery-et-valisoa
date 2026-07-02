/**
 * Script à utiliser avec Google Sheets pour recevoir les réponses
 * du formulaire de confirmation du site de mariage.
 *
 * MISE EN PLACE (5 minutes) :
 *
 * 1. Va sur https://sheets.google.com et crée un nouveau classeur vide.
 *    Nomme-le par exemple "Réponses mariage Hery & Valisoa".
 *
 * 2. Dans la première ligne, ajoute ces en-têtes de colonnes :
 *    A1: Horodatage   B1: Email   C1: Téléphone   D1: Présence   E1: Question
 *
 * 3. Copie l'identifiant de ce Sheet depuis son URL :
 *    https://docs.google.com/spreadsheets/d/CET_IDENTIFIANT_ICI/edit
 *    et colle-le ci-dessous à la place de 'COLLE_L_ID_DE_TON_SHEET_ICI'.
 *
 * 4. Dans le menu du Sheet : Extensions > Apps Script.
 *    Supprime le code par défaut et colle tout le contenu de ce fichier
 *    (une fois l'étape 3 faite).
 *
 * 5. Clique sur "Déployer" > "Nouveau déploiement".
 *    - Type : "Application Web"
 *    - Exécuter en tant que : Moi
 *    - Qui a accès : Tout le monde
 *    Clique sur "Déployer" et autorise les permissions demandées
 *    (c'est ton propre script, sur ton propre compte Google).
 *
 * 6. Copie l'URL fournie (elle se termine par /exec).
 *
 * 7. Colle cette URL dans script.js, à la ligne :
 *    const RSVP_ENDPOINT = 'REMPLACE_PAR_TON_URL_APPS_SCRIPT';
 *
 * Chaque réponse au formulaire ajoutera automatiquement une ligne dans ce Sheet.
 * Tu pourras l'ouvrir à tout moment, filtrer les "Oui"/"Non", et l'exporter
 * en .xlsx via Fichier > Télécharger > Microsoft Excel (.xlsx).
 *
 * Si tu modifies le formulaire plus tard (nouveaux champs), pense à mettre à
 * jour à la fois les en-têtes du Sheet et la liste `sheet.appendRow([...])`
 * ci-dessous pour que les colonnes restent alignées.
 *
 * Si tu modifies ce script après l'avoir déjà déployé, retourne dans
 * Déployer > Gérer les déploiements > icône crayon > Nouvelle version
 * pour que le changement soit pris en compte (l'URL /exec reste la même).
 */
const SHEET_ID = 'COLLE_L_ID_DE_TON_SHEET_ICI';

function doPost(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  const params = e.parameter;

  sheet.appendRow([
    new Date(),
    params.email || '',
    params.phone || '',
    params.attending || '',
    params.question || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
