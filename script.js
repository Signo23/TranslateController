let loadedFiles = new Map;
let mainFile;
let isReadyForSubmit = false;

/**
 * Download a JSON file containing the not translated label for each language.
 */
function downloadAllNotTranslated(){

  //Copy of main keys
  const keys = Object.keys(mainFile);

  //Copy of sub keys
  let subKeys = new Map();
  keys.forEach(key => {
      subKeys.set(key, Object.keys(mainFile[key]));
  });

  let result = {};

  //Filtering keys in other language
  loadedFiles.forEach(f =>{
    fileName = getKeyByValue(loadedFiles, f);
    result[fileName] = {};
    keys.forEach(key => {
      loadItemNotTransated(fileName, f, key, subKeys, result);
    });
  });

  download(JSON.stringify(result, null, 2), 'notTranslated.json', 'application/json');
}

/**
 * Get the key of a value
 * @param {*} map to search into
 * @param {*} searchValue the value of the key
 * @returns 
 */
function getKeyByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
}

/**
 * Load the not translated labels.
 * @param {*} langPrefix Prefix of language
 * @param {*} object The object to search keys into
 * @param {*} key The key to search
 * @param {*} subkeys The map of subkeys
 * @param {*} result The object to load missing keys into
 */
 function loadItemNotTransated(langPrefix, object, key, subkeys, result){
    if(object.hasOwnProperty(key)){
        let item = object[key];
        let sub = [];
        subkeys.get(key).forEach(subKey => {
            if(!item.hasOwnProperty(subKey)){
                sub.push(subKey);
            }
        });
        if(sub[0] != null) {
            result[langPrefix][key] = sub;
        }
    } else {
        result[langPrefix][key] = "All";
    }
}

/**
 * Handle the main event for main file
 * @param {*} evt of main file upload
 */
function handleFileSelect(evt) {
  let files = evt.target.files; // FileList object

  // use the 1st file from the list
  let f = files[0];
  
  let reader = new FileReader();

  // Closure to capture the file information.
  reader.onload = (function(theFile) {
      return function(e) {
          
        data = JSON.parse(e.target.result);
        mainFile = (f.name, data);
      };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);
  }

/**
 * Handle the main event for main file
 * @param {*} evt of main file upload
 */
  function handleFileSelectMultiple(evt) {
    let files = [...evt.target.files]; // FileList object
    files.forEach(f => {
      let reader = new FileReader();
  
      // Closure to capture the file information.
      reader.onload = (function(theFile) {
          return function(e) {
              data = JSON.parse(e.target.result);
              loadedFiles.set(f.name, data);
          };
          })(f);
    
          // Read in the image file as a data URL.
          reader.readAsText(f);
    });
    }

/**
 * Create and download a file.
 * @param {*} content The content to insert in the file 
 * @param {*} fileName File's name
 * @param {*} contentType File's content type
 */
function download(content, fileName, contentType) {
  let a = document.createElement("a");
  let file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

/**
 * Check if all data are loaded
 */
function checkDownload(){
  main = document.getElementById('file').value;
  files = document.getElementById('multipleFile').value;
  if(main != "" && files != ""){
    isReadyForSubmit = true;
  } else {
    isReadyForSubmit = false;
  }
  document.getElementById('download').disabled = !isReadyForSubmit;
}


document.addEventListener("DOMContentLoaded", function(event) { 
  document.getElementById('file').addEventListener('change', handleFileSelect, false);
  document.getElementById('multipleFile').addEventListener('change', handleFileSelectMultiple, false);
  document.getElementById('download').disabled = !isReadyForSubmit;
});