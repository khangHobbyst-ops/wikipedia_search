const modalID = "popup_wikipedia_iframe";

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const width = 800;
const height=400;
var current='';

function check_to_erase(event){
    if ( event.target.id !== "wikiIT" &&
         event.target.id !== modalID && 
            event.target.id !=='wikiLoadingPic'
        ) {
         
        for (const ID_x of ["wikiIT",modalID,'wikiLoadingPic'])
        {
            const all_elements=document.querySelectorAll(`#${ID_x}`);

            for (const elem of all_elements) 
                elem.remove();
        }
    }
}

function place_iframe(event,iframe){

        const rect = event.target.getBoundingClientRect();

        // Calculate left/right position
        if (rect.left + width < windowWidth) {
            iframe.style.left = `${rect.left + window.scrollX}px`;
            iframe.style.right = '';
        } else {
            iframe.style.right = `${windowWidth - rect.right - window.scrollX}px`;
            iframe.style.left = '';
        }

        // Calculate top/bottom position
        if (rect.top + height < windowHeight) {
            iframe.style.top = `${rect.top + window.scrollY}px`;
            iframe.style.bottom = '';
        } else {
            iframe.style.bottom = `${windowHeight - rect.bottom - window.scrollY}px`;
            iframe.style.top = '';
        }

}

function retriveSearch(searchWord,event){
    const img = document.createElement('img');

    img.src = chrome.runtime.getURL("images/Wikipedia-logo-v2.svg.png");
    img.id = 'wikiIT';
    img.width = 35;
    img.height = 35;
    img.style.position = 'absolute';
    img.style.zIndex = '10001';

    // Get bounding rect of event.target
    const rect = event.target.getBoundingClientRect();
    img.style.top = `${rect.top + window.scrollY}px`;
    img.style.left = `${rect.left + window.scrollX}px`;

    document.body.appendChild(img);

    const iframe = document.createElement('iframe');
        iframe.style.display='none';
        iframe.src = `https://en.m.wikipedia.org/w/index.php?search=${searchWord}`;
        iframe.id = "popup_wikipedia_iframe";
        iframe.style.position = 'absolute';
        iframe.style.width = `${width}px`;
        iframe.style.height = `${height}px`;
        //iframe.style.paddingBottom='35px';
        iframe.style.backgroundColor='white';
        place_iframe(event, iframe);
    document.body.appendChild(iframe);


    img.onclick = function(event) {
        event.stopPropagation(); // Prevent global click handler from firing
        
        
        const loading_pic = document.createElement('img');
        loading_pic.id='wikiLoadingPic';
        loading_pic.src = chrome.runtime.getURL("images/Loading_icon.gif");
        loading_pic.width = width;
        loading_pic.height = height;
        loading_pic.style.position = 'absolute';
        loading_pic.style.zIndex = '10002';
        place_iframe(event, loading_pic);
        document.body.appendChild(loading_pic);

        iframe.addEventListener('load', () => {
            iframe.style.zIndex='10001';
            iframe.style.display = 'inline';
            loading_pic.remove();
        });
        
        this.remove();
    }
}

document.addEventListener('selectionchange', (event) => {
  if(document.getSelection().type == "Range"){//something is selected
        if(typeof document.getSelection().focusNode.nodeValue == "string"){//a string is selected
            if(document.getSelection().getRangeAt(0).toString().trim().length > 0){//the string is not empty or whitespace
                current = document.getSelection().getRangeAt(0).toString().trim();
                
            }
        }
    }
});

document.addEventListener('mouseup', (event) => {

    if (current)
    {
        retriveSearch(current, event);
        current='';
    }
});
var objectHREF=undefined;
var old_pos={X:undefined, Y:undefined};

document.addEventListener('mouseover', (event) => {
    if (event.target.closest('a')) {
        const linkElement = event.target.closest('a');
        //update pos
        old_pos.X = event.clientX;
        old_pos.Y = event.clientY;

        if (objectHREF !== event.target) {
            objectHREF = event.target;
            //remove the other icons
            check_to_erase(event);

            const href = linkElement.getAttribute('href');
            // Check if href is a valid URL (starts with http or https)
            if (href
                // && /^https?:\/\//.test(href)
            ) {
                const searchWord = linkElement.textContent.trim();
                retriveSearch(searchWord, event);
            }
        }
    }
});
document.addEventListener('mousemove', (event) => {
    if (objectHREF && old_pos.X !== undefined && old_pos.Y !== undefined) {
        const rect = objectHREF.getBoundingClientRect();
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Check if mouse is outside the bounding rect of objectHREF
        if (
            mouseX < rect.left ||
            mouseX > rect.right ||
            mouseY < rect.top ||
            mouseY > rect.bottom
        ) {
            objectHREF = undefined;
            old_pos = { X: undefined, Y: undefined };
            check_to_erase(event);
        }
    }
});
document.addEventListener('mousedown', function(event){
    // Ignore clicks on the Wiki it img
    check_to_erase(event);
}, false);

