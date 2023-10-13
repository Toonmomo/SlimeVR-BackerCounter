// Replace nombreDePages with the last backer page, the one with the Crowdsupply logo at the bottom.
let nombreDePages = 102;
let chaineRecherchee = 'YOURNAMEHERE'; // Replace with the name of the backer you're looking for.
async function trouverElementAvecChaine(nombreDePages, chaineRecherchee) {
    let found = false;
    let pageAvecChaine;
    let numeroElementAvecChaine;
    let elementsAvecChaine = [];
    let totalElementsComptes = 0;
    let promises = [];
    for (let i = 1; i <= nombreDePages && !found; i++) {
        let url = `https://www.crowdsupply.com/slimevr/slimevr-full-body-tracker/backers?page=${i}`;
        promises.push(fetch(url).then(response => response.text()));
    }
    let responses = await Promise.all(promises);
    for (let i = responses.length - 1; i >= 0 && !found; i--) {
        let html = responses[i];

        let tempElement = document.createElement('div');
        tempElement.innerHTML = html;

        let elementsSurPage = Array.from(tempElement.querySelectorAll('.mt-2')).reverse();

        totalElementsComptes += elementsSurPage.length;

        for (let j = 0; j < elementsSurPage.length; j++) {
            let elementText = elementsSurPage[j].textContent || elementsSurPage[j].innerText;
            if (elementText.includes(chaineRecherchee)) {
                found = true;
                pageAvecChaine = i + 1;
                numeroElementAvecChaine = j + 1; // Index basé sur 1
                elementsAvecChaine = elementsSurPage;
                break;
            }
        }
        if (found) {
            totalElementsComptes -= elementsSurPage.length - numeroElementAvecChaine;
        }
    }
    if (found) {
        console.log(`Name "${chaineRecherchee}" found at page ${pageAvecChaine}.`);
        console.log(`Backer detail : ${elementsAvecChaine[numeroElementAvecChaine - 1].textContent}`);
    } else {
        console.log(`Name "${chaineRecherchee}" not found.`);
    }
    console.log(`Backer N° : ${totalElementsComptes}`);

    return { pageAvecChaine, numeroElementAvecChaine, contenuElement: elementsAvecChaine[numeroElementAvecChaine - 1].textContent, totalElementsComptes };
}
trouverElementAvecChaine(nombreDePages, chaineRecherchee).then(resultat => {
    console.log('Résultat de la recherche :', resultat);
}).catch(error => {
    console.error('Erreur : ', error);
});
