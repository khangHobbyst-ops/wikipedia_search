const modalID = "popup_wikipedia_iframe";

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const width = 800;
const height=400;
var current='';
function place_iframe(event,iframe){
    
        if (event.clientX + width < windowWidth)
        {
            iframe.style.left = `${event.clientX}px`;
            iframe.style.right = ''; // Ensure right style is cleared
        }
        else{
            iframe.style.right = `${windowWidth - event.clientX}px`;
            iframe.style.left = ''; // Ensure left style is cleared
        }
            

        if (event.clientY + height < windowHeight)
        {
            iframe.style.top = `${event.clientY}px`;
            iframe.style.bottom = ''; // Ensure bottom style is cleared
        }
        else
        {
            iframe.style.bottom = `${windowHeight - event.clientY}px`;
            iframe.style.top = ''; // Ensure top style is cleared
        }

}

function retriveSearch(searchWord,event){
    const img = document.createElement('img');

    img.src = chrome.runtime.getURL("images/Wikipedia-logo-v2.svg.png");
    img.id = 'wikiIT';
    img.width = 35;
    img.height = 35;
    img.style.position = 'fixed';
    img.style.top = `${event.clientY}px`;
    img.style.left = `${event.clientX}px`;
    img.style.zIndex = '10001';
    document.body.appendChild(img);

    const iframe = document.createElement('iframe');
        iframe.style.display='none';
        iframe.src = `https://en.m.wikipedia.org/w/index.php?search=${searchWord}`;
        iframe.id = "popup_wikipedia_iframe";
        iframe.style.position = 'fixed';
        iframe.style.width = `${width}px`;
        iframe.style.height = `${height}px`;
        place_iframe(event, iframe);
    document.body.appendChild(iframe);


    img.onclick = function(event) {
        event.stopPropagation(); // Prevent global click handler from firing
        
        
        
        const loading_pic = document.createElement('img');
        loading_pic.src = chrome.runtime.getURL("images/Loading_icon.gif");
        loading_pic.width = width;
        loading_pic.height = height;
        loading_pic.style.position = 'fixed';
        loading_pic.style.zIndex = '10002';
        place_iframe(event, loading_pic);
        document.body.appendChild(loading_pic);

        iframe.addEventListener('load', () => {
            console.log('loaded');
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
    console.log(current);

    if (current)
    {
        retriveSearch(current, event);
        current='';
    }
});

// document.addEventListener('dblclick', function (event) {
//     if(document.getSelection().type == "Range"){//something is selected
//         if(typeof document.getSelection().focusNode.nodeValue == "string"){//a string is selected
//             if(document.getSelection().getRangeAt(0).toString().trim().length > 0){//the string is not empty or whitespace
//                 let searchWord = document.getSelection().getRangeAt(0).toString().trim();
//                 retriveSearch(searchWord, event);
//             }
//         }
//     }
// });

document.addEventListener('mousedown', function(event){
    const iframe = document.getElementById(modalID);
    // Ignore clicks on the Wiki it img
    if (iframe && event.target.id !== "wikiIT" && event.target.id !== modalID) {
        iframe.remove();
        const img = document.getElementById('wikiIT');

        if (img) img.remove();
    }
}, false);

