var searchString = 'YOURNAMEHERE';
var totalPages = 102;
var elementClassToCount = 'mt-2';
var totalElementsWithClass = 0;
function countElementsWithClass(pageContent) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(pageContent, 'text/html');
    var elements = doc.querySelectorAll('.' + elementClassToCount);
    return elements;
}
async function processPages(pageNum) {
    console.log("Searching...")
    if (pageNum > 0) {
        var pagePromises = [];

        for (var i = pageNum; i >= 1; i--) {
            var pageUrl = "https://www.crowdsupply.com/slimevr/slimevr-full-body-tracker/backers?page=" + i;
            pagePromises.push(fetch(pageUrl).then(response => response.text()));
        }

        try {
            var pageContents = await Promise.all(pagePromises);
            var stopSearch = false;

            for (var j = 0; j < pageContents.length; j++) {
                var elements = countElementsWithClass(pageContents[j]);
                for (var k = elements.length - 1; k >= 0; k--) {
                    totalElementsWithClass++;

                    if (elements[k].textContent.includes(searchString)) {
                        console.log("Backer '" + searchString + "' found at page " + (pageNum - j) + ". Stopping research.");
                        totalElementsWithClass--;
                        console.log("Backer Number : " + totalElementsWithClass);
                        stopSearch = true;
                        break;
                    }
                }
                if (stopSearch) break;
            }

            if (!stopSearch) {
                processPages(pageNum - pageContents.length);
            }
        } catch (error) {
            console.error("Error while processing pages: " + error);
        }
    } else {
        console.log("Backer Number : " + totalElementsWithClass);
    }
}
processPages(totalPages);
