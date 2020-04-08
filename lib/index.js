import fetch from 'isomorphic-unfetch'

async function translateAPI(sourceLang, targetLang, sourceText){
  let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);

  let response = await fetch(url);
  let data = await response.json();

  // return sudah berupa text translate, jika gagal akan meresponse string kosong
  return mergeResponseTranslate(data[0]);

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

function serializeText(text){
  // hapus double quotes dari hasil translate
  return text.replace(/"([^"]+(?="))"/g, '$1')
}

function IsValidJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}


export {
  translateAPI,
  IsValidJSONString
}