// var fs = require('fs');
//const { xml2json } = require('xml-js'); 
// const xml2js = require('xml2js')

function xmltojson(xml) {
    // Create the return object
    var obj = {};
  
    if (xml.nodeType == 1) {
      // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) {
      // text
      obj = xml.nodeValue;
    }
  
    // do children
    // If all text nodes inside, get concatenated text from them.
    var textNodes = [].slice.call(xml.childNodes).filter(function(node) {
      return node.nodeType === 3;
    });
    if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
      obj = [].slice.call(xml.childNodes).reduce(function(text, node) {
        return text + node.nodeValue;
      }, "");
    } else if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof obj[nodeName] == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  }

// function xmltojson(xml){
//     console.log(xml)
//     // const json = xml2js(xml, { spaces: 2, compact: true });

//     xml2js.parseString(xml, (err, result) => {
//         if (err) {
//           throw err
//         } 
//         const json = JSON.stringify(result, null, 4) 
//         console.log(json)})
//     console.log(json.data)
//     return json
// }

function jsonToxml(x){
    let xml = `<?xml version="1.0" encoding="UTF-8"?>`
        xml += `<root id = ` + x._id + `>`
        xml += `<sender>` + x.sender + `</sender>`
        xml += `<receiver>` + x.receiver + `</receiver>`
        for (let i = 0; i < x.chat.length; i++) {
            xml += `
    <chat> `+
                x.chat[i] + `
    </chat>`
        }
        xml += `</root>`

    return xml
}

function userLogin(x){
  console.log(x)
  let xml = `<?xml version="1.0" encoding="UTF-8"?>`
        xml += `<root >`
        xml+=`<authtoken>`+ x.authtoken+`</authtoken>`
        xml+=`<user>`
        xml +=`<name>`+x.user.name+`</name>`
        xml +=`<email>`+x.user.email+`</email>`
        xml += `<password>` + x.user.password + `</password>`
        xml += `<username>` + x.user.username + `</username>`
        xml +=`<_id>`+x.user._id+`+</_id>`
        xml +=`<date>`+x.user.date+`+</name>`
        xml+=`</user>`
        xml += `</root>`
    console.log(xml)
    return xml
}


function getUser(x){
  let xml = `<?xml version="1.0" encoding="UTF-8"?>`
        xml += `<root >`
        xml+=`<authtoken>`+ x.authtoken+`</authtoken>`
        xml+=`<user>`
        xml +=`<uname>`+x.uname+`</uname>`
        xml +=`<umail>`+x.umail+`+</umail>` 
        xml +=`<uid>`+x.uid+`+</uid>` 
        xml+=`</user>`
        xml += `</root>`
    console.log(xml)
    return xml
}

module.exports = { jsonToxml, xmltojson, userLogin, getUser }