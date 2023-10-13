const base_url = "https://www.crowdsupply.com/slimevr/slimevr-full-body-tracker/backers?page=";
const num_pages = 102; // Total number of pages (starting from the last)
const specified_string = "YOURNAMEHERE"; // Replace this with the specified string to stop counting

async function findPageWithSpecifiedString() {
    const fetchPromises = Array.from({ length: num_pages }, (_, i) => fetch(`${base_url}${num_pages - i}`).then(response => response.text()));

    try {
        const responses = await Promise.all(fetchPromises);
        for (let i = 0; i < responses.length; i++) {
            if (responses[i].includes(specified_string)) {
                const foundPage = num_pages - i;
                console.log(`Specified string found on page ${foundPage}.`);
                return foundPage;
            }
        }
        console.log("Specified string not found on any page.");
        return null;
    } catch (error) {
        console.error("Error fetching pages:", error);
        return null;
    }
}

async function countElementsOnPage(pageNumber) {
    const response = await fetch(`${base_url}${pageNumber}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const mt2Elements = doc.querySelectorAll('.mt-2');
    return mt2Elements.length;
}

async function main() {
    console.log("Searching for the specified string...");
    const foundPage = await findPageWithSpecifiedString();

    if (foundPage !== null) {
        console.log(`Specified string found on page ${foundPage}. Counting 'mt-2' elements...`);
        const tasks = Array.from({ length: foundPage }, (_, i) => countElementsOnPage(i + 1));

        try {
            const results = await Promise.all(tasks);
            const totalCount = results.reduce((acc, count) => acc + count, 0);
            console.log(`Total count of 'mt-2' elements between page 1 and page ${foundPage}: ${totalCount}`);
        } catch (error) {
            console.error("Error counting elements:", error);
        }
    } else {
        console.log("Cannot count 'mt-2' elements because the specified string was not found.");
    }
}

main();
