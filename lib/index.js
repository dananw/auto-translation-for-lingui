import fetch from 'isomorphic-unfetch'
import to from 'await-to-js'

async function translateAPI(sourceLang, targetLang, sourceText){
  
  let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);

  const [err, res] = await to(fetch(url));
  
  if(err) {
    return null
  }else{
    let data = await res.json();
    
    // return sudah berupa text translate, jika gagal akan meresponse string kosong
    return mergeResponseTranslate(data[0]);
  }
}

function mergeResponseTranslate(arr) {
  // Karna google translate api melakukan split text setiap ada titik. maka perlu di gabungkan dulu
  if(arr && arr.length != 0) {
    let tmpString = "";

    for(let i = 0; i < arr.length; i++) {
      tmpString += serializeText(arr[i][0]);
    }
    return tmpString;
  }

  alert('Response from server is not array, or array empty')
  return ""
}

async function toParagraph(source) {
  let paragraph = "";

  for (let key in source) {
    paragraph += '[' + key + ']';
  }

  return paragraph;
}

async function paragraphToArray(text) {
  let pattern = /\[(.*?)\]/g;
  let matches = []
  let match;

  while ((match = pattern.exec(text)) != null) {
    matches.push(match[1]);
  }

  return matches;
}

function serializeText(text){
  // hapus double quotes dari hasil translate
  return text.replace(/"([^"]+(?="))"/g, '$1')
}

function isValidJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}


export {
  translateAPI,
  isValidJSONString,
  toParagraph,
  paragraphToArray,
  isEmpty,
}