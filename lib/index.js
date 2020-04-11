import fetch from 'isomorphic-unfetch'
import to from 'await-to-js'
import querystring from 'querystring'

async function translateAPI(sourceLang, targetLang, sourceText){
  // let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
  let baseUrl = 'https://translate.googleapis.com/translate_a/single';

  let data = {
    client: 'gtx',
    sl: sourceLang,
    tl: targetLang,
    hl: targetLang,
    dt: 't',
    ie: 'UTF-8',
    oe: 'UTF-8',
    otf: 1,
    ssel: 0,
    tsel: 0,
    kc: 7,
    q: sourceText,
  };


  // Append query string to the request URL.
  let url = `${baseUrl}?${querystring.stringify(data)}`;

  let requestOptions;

  // If request URL is greater than 2048 characters, use POST method.
  if(url.length > 2048) {
    delete data.q
    requestOptions = [
      `${baseUrl}?${querystring.stringify(data)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          q: sourceText
        }
      }
    ]
  }else{
    requestOptions = [url];
  }

  const [err, res] = await to(fetch(...requestOptions));

  if(err) {
    return null
  }else{
    let data = await res.json();
    console.log(data)
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