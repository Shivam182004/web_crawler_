const {JSDOM} = require ('jsdom')

async function crawlUrl(baseURL ,currentUrl, pages){
const baseURLobj = new URL(baseURL)
const currentUrlobj = new URL(currentUrl)
if (baseURLobj.hostname !== currentUrlobj.hostname){
     return pages
} 

const normalizCurrentUrl = normalizeUrl(currentUrl)
if(pages[normalizCurrentUrl] > 0 ){
  pages[normalizCurrentUrl]++
  return pages
}
  pages[normalizCurrentUrl] = 1
  
  console.log(`ACTIVELY CRAWLING : ${currentUrl}`)
  try{
    const resp = await fetch(currentUrl)
    
   
    if(resp.status > 399){
      console.log(`Error fetch in the link with status code ${resp.status} on page ${currentUrl}`)
      return pages
    }
    const contentType = resp.headers.get("content-type")

    if(!contentType.includes('text/html')){
      console.log(`Not an html or text type content it is type of  ${contentType} on page ${currentUrl}`)
      return pages
    }

    const htmlBody = await resp.text()
    const nextUrls =getURLsFromHTML(htmlBody , baseURL)

    for(const nextUrl of nextUrls){
     pages = await crawlUrl(baseURL , nextUrl, pages)
    }
  }catch(err){
    console.log(`The url is invalid : ${err.message} ${currentUrl}`)
  }
  return pages
}

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const aElements = dom.window.document.querySelectorAll('a')
    for (const aElement of aElements){
      if (aElement.href.slice(0,1) === '/'){
        // for relative url 
        try {
          urls.push(new URL(aElement.href, baseURL).href)
        } catch (err){
          console.log(`${err.message}: ${aElement.href}`)
        }
      } else {
        // for absolute url 
        try {
          urls.push(new URL(aElement.href).href)
        } catch (err){
          console.log(`${err.message}: ${aElement.href}`)
        }
      }
    }
    return urls
  }


function normalizeUrl(urlString){
    const urlObj = new URL(urlString)
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`
  if(hostPath.length >0 && hostPath.slice(-1)=== "/"){
    return hostPath.slice(0, -1)
  }
  else{
    return hostPath
  }

}

module.exports={
    normalizeUrl,
    getURLsFromHTML,
    crawlUrl
}