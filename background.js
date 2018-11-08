const fileName = 'easylist.txt';
const transferProtocol = /\w*:\/\//g;
const domainNameRegex = /\w*:\/\/(\w*\d*[.-])*\w*/g;
const url = chrome.runtime.getURL(fileName);

let exceptions = [];
let filters = [];
fetch(url)
  .then(response => {return response.text()})
  .then(text => {return text.split('\n')})
  .then(filtersArr => {
    filtersArr.forEach(function (v)
    {
        if(v.charAt(0) !== '!')
        {
          if(v.charAt(0) === '@' && v.charAt(1) === '@')
          {
            exceptions.push(v);
          }
          else
          {
            filters.push(v);
          }
        }
    }
  );
  });
  // chrome.webRequest.onBeforeSendHeaders.addListener(
  //     function (details) {
  //         let urlFull = details.url;
  //         let domainName = urlFull.match(domainNameRegex)[0];
  //         let patternModified = domainName.replace(transferProtocol, '||');
  //         if(filters.length > 0)
  //         {
  //           filters.forEach(v => {
  //               if(v.search(patternModified) > 0)// ||
  //                   // v.search(domainName) > 0)
  //               {
  //                 // console.log(domainName);
  //                 console.log(patternModified);
  //                 console.log("Данный находится в списке ненадежных: " + v);
  //                 return {cancel:true};
  //               }
  //           });
  //         }
  //         else {
  //           console.log("read file");
  //         }
  //     },
  //     { urls: ["<all_urls>"]},
  //     ["blocking","requestHeaders"]
  // );

  chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        let urlFull = details.url;
        let domainName = urlFull.match(domainNameRegex)[0];
        let patternModified = domainName.replace(transferProtocol, '||');
        if(filters.length > 0)
        {
          filters.forEach(v => {
            console.log(domainName);
            console.log(patternModified);
              if(v.search(patternModified) > 0)// ||
                  // v.search(domainName) > 0)
              {
                // console.log(domainName);
                // console.log(patternModified);
                console.log("Данный находится в списке ненадежных: " + v);
                return {cancel:true};
              }
          });
        }
        else {
          console.log("read file");
        }
      },
      { urls: ["<all_urls>"]},
      ["blocking","requestBody"]
  );
  // let pat = response.text.split('\n');
    // pat.forEach(function (v)
    // {
    //     if(v.chartAt[0] == '!')
    //     {
    //       console.log(v);
    //     }
    // });


// const readFile = async (url) => {
//   const response = await fetch(url);
//   const text = await response.text();
//
//   let splited = patternsParser(text);
// }

// readFile(url);

// function patternsParser(text)
// {
//   let pat = text.split('\n');
//   console.dir(text.isFullfield);
//   pat.forEach(function (v)
//   {
      // if(v.chartAt[0] == '!')
      // {
        // console.log(v);
      // }
//   });
//   return patterns;
// }
