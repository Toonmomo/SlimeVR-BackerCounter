let numberOfPages = 102; //replace this with total number of backer pages
let searchQuery = 'YOURNAMEHERE'; //replae this with the name you're looking for
console.log("Searching. . .")
async function findElementsWithString(nombreDePages, chaineRecherchee) {
    let found = false;
    let pageWithString;
    let indexOfString;
    let elementsWithString = [];
    let backerNumber = 0;
    let promises = [];
    for (let i = 1; i <= numberOfPages && !found; i++) {
        let url = `https://www.crowdsupply.com/slimevr/slimevr-full-body-tracker/backers?page=${i}`;
        promises.push(fetch(url).then(response => response.text()));
    }
    let responses = await Promise.all(promises);
    for (let i = responses.length - 1; i >= 0 && !found; i--) {
        let html = responses[i];
        let tempElement = document.createElement('div');
        tempElement.innerHTML = html;
        let elementsOnPage = Array.from(tempElement.querySelectorAll('.mt-2')).reverse();
        backerNumber += elementsOnPage.length;
        for (let j = 0; j < elementsOnPage.length; j++) {
            let elementText = elementsOnPage[j].textContent || elementsOnPage[j].innerText;
            if (elementText.includes(chaineRecherchee)) {
                found = true;
                pageWithString = i + 1;
                indexOfString = j + 1;
                elementsWithString = elementsOnPage;
                break;
            }
        }
        if (found) {
            backerNumber -= elementsOnPage.length - indexOfString;
        }
    }
    if (found) {
        console.log(`Name "${searchQuery}" found on page ${pageWithString}.`);
        console.log(`Backer Info : ${elementsWithString[indexOfString - 1].textContent}`);
    } else {
        console.log(`Name "${searchQuery}" not found.`);
    }

    console.log(`Backer N° ${backerNumber}`);

    return { pageWithString, indexOfString, elementContent: elementsWithString[indexOfString - 1].textContent, backerNumber };
}
findElementsWithString(numberOfPages, searchQuery).then(resultat => {
    console.log('Result :', resultat);
}).catch(error => {
    console.error('Error : ', error);
});
